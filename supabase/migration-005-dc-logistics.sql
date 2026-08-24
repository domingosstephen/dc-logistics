-- DC Logistics Brasil — full schema migration
-- Replaces migrations 001-004 (pet-shipping era)
-- Run in Supabase SQL Editor on a fresh database,
-- or apply the alter/drop/add sections on an existing one.

-- ============================================
-- §0.1  is_staff() — replaces bare `using (true)` policies
-- ============================================

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('staff', 'admin')
  );
$$;

-- ============================================
-- §0.3  No auto-profile trigger
-- Any existing trigger that creates a profile row on
-- auth.users insert must be dropped. Profiles are inserted
-- deliberately, by an admin only.
-- ============================================

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- ============================================
-- §2.1  Status enum — freight rail order
-- ============================================

-- Rename old enum out of the way (if it exists from migration-001)
do $$
begin
  if exists (select 1 from pg_type where typname = 'shipment_status') then
    -- Postgres does not support ALTER TYPE ... RENAME VALUE before v14 for enums.
    -- We rename the type and recreate it fresh.
    alter type shipment_status rename to shipment_status_old;
  end if;
end $$;

create type shipment_status as enum (
  'registered',
  'received',
  'processing',
  'export_clearance',
  'in_transit',
  'import_clearance',
  'out_for_delivery',
  'delivered',
  'on_hold',
  'returned',
  'cancelled'
);

-- ============================================
-- §2.2  shipments table — freight schema
-- ============================================

create table if not exists public.shipments (
  id                  uuid primary key default gen_random_uuid(),
  tracking_code       text unique not null,
  status              shipment_status not null default 'registered',
  origin_city         text not null,
  origin_country      text not null,
  destination_city    text not null,
  destination_country text not null,
  description         text not null,
  pieces              int  not null default 1,
  weight_kg           numeric(10,2),
  dimensions          text,
  declared_value      numeric(12,2),
  currency            text default 'BRL',
  recipient_name      text,
  recipient_phone     text,
  recipient_address   text,
  client_name         text,
  client_email        text,
  carrier_ref         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- If migrating from pet schema, apply these alters instead:
-- ALTER TABLE public.shipments
--   DROP COLUMN IF EXISTS pet_name,
--   DROP COLUMN IF EXISTS pet_species,
--   DROP COLUMN IF EXISTS pet_breed,
--   DROP COLUMN IF EXISTS pet_photo_path,
--   DROP COLUMN IF EXISTS estimated_delivery,
--   DROP COLUMN IF EXISTS departure_date,
--   DROP COLUMN IF EXISTS departure_time,
--   DROP COLUMN IF EXISTS arrival_time,
--   DROP COLUMN IF EXISTS sender_name,
--   DROP COLUMN IF EXISTS sender_email,
--   DROP COLUMN IF EXISTS sender_phone,
--   DROP COLUMN IF EXISTS sender_address,
--   DROP COLUMN IF EXISTS receiver_name,
--   DROP COLUMN IF EXISTS receiver_email,
--   DROP COLUMN IF EXISTS receiver_phone,
--   DROP COLUMN IF EXISTS receiver_address,
--   RENAME COLUMN customer_name TO client_name,
--   RENAME COLUMN customer_email TO client_email;
-- ALTER TABLE public.shipments
--   ADD COLUMN IF NOT EXISTS description text not null default '',
--   ADD COLUMN IF NOT EXISTS pieces int not null default 1,
--   ADD COLUMN IF NOT EXISTS weight_kg numeric(10,2),
--   ADD COLUMN IF NOT EXISTS dimensions text,
--   ADD COLUMN IF NOT EXISTS declared_value numeric(12,2),
--   ADD COLUMN IF NOT EXISTS currency text default 'BRL',
--   ADD COLUMN IF NOT EXISTS recipient_name text,
--   ADD COLUMN IF NOT EXISTS recipient_phone text,
--   ADD COLUMN IF NOT EXISTS recipient_address text,
--   ADD COLUMN IF NOT EXISTS carrier_ref text;

-- ============================================
-- §2.2  shipment_events — with audit trail columns
-- ============================================

create table if not exists public.shipment_events (
  id           uuid primary key default gen_random_uuid(),
  shipment_id  uuid not null references public.shipments(id) on delete cascade,
  status       shipment_status not null,
  location     text,
  note         text,
  happened_at  timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz,
  updated_by   uuid references auth.users(id)
);

create index if not exists shipment_events_shipment_happened
  on public.shipment_events (shipment_id, happened_at desc);

-- before-update trigger: stamp updated_at / updated_by
create or replace function public.stamp_event_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists trg_stamp_event_update on public.shipment_events;
create trigger trg_stamp_event_update
  before update on public.shipment_events
  for each row execute function public.stamp_event_update();

-- ============================================
-- §0.2  Audit table for shipment_events
-- ============================================

create table if not exists public.shipment_events_audit (
  audit_id      uuid primary key default gen_random_uuid(),
  operation     text not null,          -- 'UPDATE' | 'DELETE'
  changed_at    timestamptz not null default now(),
  changed_by    uuid references auth.users(id),
  -- snapshot of the row as it was before the change
  event_id      uuid,
  shipment_id   uuid,
  status        shipment_status,
  location      text,
  note          text,
  happened_at   timestamptz,
  created_at    timestamptz
);

create or replace function public.audit_event_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.shipment_events_audit (
    operation, changed_by,
    event_id, shipment_id, status, location, note,
    happened_at, created_at
  ) values (
    tg_op, auth.uid(),
    old.id, old.shipment_id, old.status, old.location, old.note,
    old.happened_at, old.created_at
  );
  return null;
end;
$$;

drop trigger if exists trg_audit_event on public.shipment_events;
create trigger trg_audit_event
  after update or delete on public.shipment_events
  for each row execute function public.audit_event_change();

-- ============================================
-- Profiles table
-- ============================================

create table if not exists public.profiles (
  id   uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'staff'
    check (role in ('staff', 'admin'))
);

-- ============================================
-- §2.4  followers (email subscriptions, double opt-in)
-- ============================================

create table if not exists public.followers (
  id               uuid primary key default gen_random_uuid(),
  shipment_id      uuid not null references public.shipments(id) on delete cascade,
  email            text not null,
  token            text unique not null default encode(gen_random_bytes(32), 'hex'),
  confirmed_at     timestamptz,
  unsubscribed_at  timestamptz,
  created_at       timestamptz not null default now(),
  unique (shipment_id, email)
);

create index if not exists followers_shipment on public.followers (shipment_id);

-- ============================================
-- §2.4  service_alerts (required expires_at)
-- ============================================

create table if not exists public.service_alerts (
  id          uuid primary key default gen_random_uuid(),
  message_pt  text not null,
  message_en  text not null,
  starts_at   timestamptz not null default now(),
  expires_at  timestamptz not null,   -- mandatory, enforced by NOT NULL
  active      boolean not null default true,
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

-- ============================================
-- §2.4  quote_requests — freight fields
-- ============================================

create table if not exists public.quote_requests (
  id                  uuid primary key default gen_random_uuid(),
  company             text,
  contact_name        text not null,
  contact_email       text not null,
  contact_phone       text,
  origin_city         text not null,
  destination_country text not null,
  destination_city    text not null,
  description         text not null,
  pieces              int,
  weight_kg           numeric(10,2),
  dimensions          text,
  declared_value      numeric(12,2),
  currency            text default 'BRL',
  notes               text,
  created_at          timestamptz not null default now()
);

-- ============================================
-- §3  Tracking number sequence
-- DCBR-YYMM-NNNNNN — resets monthly
-- ============================================

create table if not exists public.tracking_sequences (
  month_key  text primary key,   -- 'YYMM'
  last_seq   int  not null default 0
);

create or replace function public.next_tracking_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_month  text;
  v_seq    int;
  v_code   text;
begin
  v_month := to_char(now(), 'YYMM');

  insert into public.tracking_sequences (month_key, last_seq)
  values (v_month, 1)
  on conflict (month_key) do update
    set last_seq = tracking_sequences.last_seq + 1
  returning last_seq into v_seq;

  v_code := 'DCBR-' || v_month || '-' || lpad(v_seq::text, 6, '0');
  return v_code;
end;
$$;

-- ============================================
-- Row Level Security
-- ============================================

alter table public.shipments         enable row level security;
alter table public.shipment_events   enable row level security;
alter table public.shipment_events_audit enable row level security;
alter table public.profiles          enable row level security;
alter table public.followers         enable row level security;
alter table public.service_alerts    enable row level security;
alter table public.quote_requests    enable row level security;
alter table public.tracking_sequences enable row level security;

-- Drop old permissive policies
drop policy if exists "staff read shipments"  on public.shipments;
drop policy if exists "staff write shipments" on public.shipments;
drop policy if exists "staff update shipments" on public.shipments;
drop policy if exists "staff delete shipments" on public.shipments;
drop policy if exists "staff read events"  on public.shipment_events;
drop policy if exists "staff write events" on public.shipment_events;
drop policy if exists "staff update events" on public.shipment_events;
drop policy if exists "self read profile"  on public.profiles;
drop policy if exists "anon insert quotes" on public.quote_requests;
drop policy if exists "auth insert quotes" on public.quote_requests;
drop policy if exists "staff read quotes"  on public.quote_requests;

-- Shipments — staff only
create policy "staff read shipments" on public.shipments
  for select to authenticated using (public.is_staff());
create policy "staff write shipments" on public.shipments
  for insert to authenticated with check (public.is_staff());
create policy "staff update shipments" on public.shipments
  for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "staff delete shipments" on public.shipments
  for delete to authenticated using (public.is_staff());

-- Events — staff only
create policy "staff read events" on public.shipment_events
  for select to authenticated using (public.is_staff());
create policy "staff write events" on public.shipment_events
  for insert to authenticated with check (public.is_staff());
create policy "staff update events" on public.shipment_events
  for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "staff delete events" on public.shipment_events
  for delete to authenticated using (public.is_staff());

-- Audit table — staff read, no direct writes (trigger only)
create policy "staff read audit" on public.shipment_events_audit
  for select to authenticated using (public.is_staff());

-- Profiles — own row only
create policy "self read profile" on public.profiles
  for select to authenticated using (id = auth.uid());

-- Followers — anon/auth insert (rate-limit enforced in app), staff read
create policy "anon insert followers" on public.followers
  for insert to anon with check (true);
create policy "auth insert followers" on public.followers
  for insert to authenticated with check (true);
create policy "staff read followers" on public.followers
  for select to authenticated using (public.is_staff());

-- Confirm/unsubscribe via token is done through security-definer RPC, not direct update

-- Service alerts — public read (active+not-expired only, enforced by view/RPC)
-- Staff manage
create policy "public read alerts" on public.service_alerts
  for select to anon using (active = true and expires_at > now());
create policy "staff manage alerts" on public.service_alerts
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Quote requests — anon/auth insert, staff read
create policy "anon insert quotes" on public.quote_requests
  for insert to anon with check (true);
create policy "auth insert quotes" on public.quote_requests
  for insert to authenticated with check (true);
create policy "staff read quotes" on public.quote_requests
  for select to authenticated using (public.is_staff());

-- Tracking sequences — staff only (via next_tracking_code() RPC for anon)
create policy "staff manage sequences" on public.tracking_sequences
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- ============================================
-- §2.3  Public tracking RPC — restricted field list
-- ============================================

create or replace function public.get_shipment_by_code(p_code text)
returns json
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (
      select json_build_object(
        'found',              true,
        'tracking_code',      s.tracking_code,
        'status',             s.status,
        'origin_city',        s.origin_city,
        'origin_country',     s.origin_country,
        'destination_city',   s.destination_city,
        'destination_country',s.destination_country,
        'pieces',             s.pieces,
        'events', coalesce((
          select json_agg(
            json_build_object(
              'status',     e.status,
              'location',   e.location,
              'note',       e.note,
              'happened_at',e.happened_at
            ) order by e.happened_at asc
          )
          from public.shipment_events e
          where e.shipment_id = s.id
        ), '[]'::json)
      )
      from public.shipments s
      where upper(regexp_replace(s.tracking_code, '[\s\-]', '', 'g'))
          = upper(regexp_replace(trim(p_code),    '[\s\-]', '', 'g'))
      limit 1
    ),
    json_build_object('found', false)
  );
$$;

grant execute on function public.get_shipment_by_code(text) to anon, authenticated;
grant execute on function public.next_tracking_code()        to authenticated;

-- ============================================
-- Follow/unsubscribe RPCs (security definer, token-gated)
-- ============================================

create or replace function public.confirm_follower(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.followers
  set confirmed_at = now()
  where token = p_token
    and confirmed_at is null
    and unsubscribed_at is null;
  return found;
end;
$$;

create or replace function public.unsubscribe_follower(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.followers
  set unsubscribed_at = now()
  where token = p_token
    and unsubscribed_at is null;
  return found;
end;
$$;

grant execute on function public.confirm_follower(text)   to anon, authenticated;
grant execute on function public.unsubscribe_follower(text) to anon, authenticated;

-- ============================================
-- Realtime on shipment_events
-- ============================================

alter publication supabase_realtime add table public.shipment_events;

-- ============================================
-- §2.5  Storage — private documents bucket
-- (Create in Supabase dashboard: bucket name 'documents', public = false)
-- Signed URLs must be generated server-side with a short TTL.
-- Never expose a public bucket for commercial documents.
-- ============================================

-- ============================================
-- Seed data — 3 example freight shipments
-- ============================================

insert into public.shipments (
  id, tracking_code, status,
  origin_city, origin_country,
  destination_city, destination_country,
  description, pieces, weight_kg, currency,
  client_name, client_email
) values
(
  '11111111-1111-1111-1111-111111111111',
  'DCBR-2608-000001', 'delivered',
  'São Paulo', 'BR', 'Lisboa', 'PT',
  'Eletrônicos — 20 unidades', 20, 48.00, 'BRL',
  'Empresa Exemplo Ltda', 'contato@exemplo.com.br'
),
(
  '22222222-2222-2222-2222-222222222222',
  'DCBR-2608-000002', 'in_transit',
  'São Paulo', 'BR', 'Miami', 'US',
  'Peças automotivas — lote 12', 5, 120.00, 'BRL',
  'Auto Parts Exportadora', 'export@autoparts.com.br'
),
(
  '33333333-3333-3333-3333-333333333333',
  'DCBR-2608-000003', 'registered',
  'Curitiba', 'BR', 'Frankfurt', 'DE',
  'Amostra comercial — roupas', 3, 8.50, 'BRL',
  'Moda Brasil Export', 'export@modabrasil.com.br'
)
on conflict (id) do nothing;

insert into public.shipment_events (shipment_id, status, location, note, happened_at) values
('11111111-1111-1111-1111-111111111111', 'registered',       'São Paulo, BR',   null, '2026-08-01 09:00:00-03'),
('11111111-1111-1111-1111-111111111111', 'received',         'São Paulo, BR',   null, '2026-08-02 10:00:00-03'),
('11111111-1111-1111-1111-111111111111', 'processing',       'São Paulo, BR',   null, '2026-08-03 11:00:00-03'),
('11111111-1111-1111-1111-111111111111', 'export_clearance', 'GRU, BR',         null, '2026-08-04 08:00:00-03'),
('11111111-1111-1111-1111-111111111111', 'in_transit',       'Atlanta, US',     null, '2026-08-06 14:00:00-03'),
('11111111-1111-1111-1111-111111111111', 'import_clearance', 'Lisboa, PT',      null, '2026-08-10 09:00:00+01'),
('11111111-1111-1111-1111-111111111111', 'out_for_delivery', 'Lisboa, PT',      null, '2026-08-11 08:00:00+01'),
('11111111-1111-1111-1111-111111111111', 'delivered',        'Lisboa, PT',      null, '2026-08-11 14:30:00+01'),
('22222222-2222-2222-2222-222222222222', 'registered',       'São Paulo, BR',   null, '2026-08-15 09:00:00-03'),
('22222222-2222-2222-2222-222222222222', 'received',         'São Paulo, BR',   null, '2026-08-16 10:00:00-03'),
('22222222-2222-2222-2222-222222222222', 'processing',       'São Paulo, BR',   null, '2026-08-17 11:00:00-03'),
('22222222-2222-2222-2222-222222222222', 'export_clearance', 'GRU, BR',         null, '2026-08-18 08:00:00-03'),
('22222222-2222-2222-2222-222222222222', 'in_transit',       'Manaus, BR',      null, '2026-08-20 14:00:00-03'),
('33333333-3333-3333-3333-333333333333', 'registered',       'Curitiba, BR',    null, '2026-08-22 09:00:00-03')
on conflict do nothing;

-- Seed tracking_sequences for current month
insert into public.tracking_sequences (month_key, last_seq)
values (to_char(now(), 'YYMM'), 3)
on conflict (month_key) do update set last_seq = greatest(tracking_sequences.last_seq, 3);
