-- ============================================================
-- DC Logistics Brasil — Supabase Schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query
-- ============================================================


-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";


-- ============================================================
-- ENUM: shipment_status
-- ============================================================
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


-- ============================================================
-- SHARED TRIGGER: updated_at
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- TABLE: profiles  (one row per auth.users row)
-- ============================================================
create table profiles (
  id   uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('staff', 'admin'))
);

alter table profiles enable row level security;

create policy "profiles: read own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: admin manage"
  on profiles for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create a staff profile whenever a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, role)
  values (new.id, 'staff')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ============================================================
-- TABLE: shipments
-- ============================================================
create table shipments (
  id                  uuid        primary key default uuid_generate_v4(),
  tracking_code       text        not null unique,
  status              shipment_status not null default 'registered',
  origin_city         text        not null,
  origin_country      text        not null,
  destination_city    text        not null,
  destination_country text        not null,
  description         text        not null,
  pieces              integer     not null default 1 check (pieces >= 1),
  weight_kg           numeric(10,2),
  dimensions          text,
  declared_value      numeric(14,2),
  currency            text        not null default 'BRL',
  recipient_name      text,
  recipient_phone     text,
  recipient_address   text,
  client_name         text,
  client_email        text,
  carrier_ref         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index on shipments (tracking_code);
create index on shipments (status);
create index on shipments (created_at desc);

alter table shipments enable row level security;

-- Only authenticated staff/admin can touch shipments directly.
-- Public tracking goes through the get_shipment_by_code() RPC.
create policy "shipments: staff select"
  on shipments for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "shipments: staff insert"
  on shipments for insert
  with check (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "shipments: staff update"
  on shipments for update
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "shipments: staff delete"
  on shipments for delete
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create trigger shipments_updated_at
  before update on shipments
  for each row execute function set_updated_at();


-- ============================================================
-- TABLE: shipment_events
-- ============================================================
create table shipment_events (
  id           uuid        primary key default uuid_generate_v4(),
  shipment_id  uuid        not null references shipments(id) on delete cascade,
  status       shipment_status not null,
  location     text,
  note         text,
  happened_at  timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz,
  updated_by   uuid        references auth.users(id)
);

create index on shipment_events (shipment_id, happened_at);

alter table shipment_events enable row level security;

create policy "events: staff select"
  on shipment_events for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "events: staff insert"
  on shipment_events for insert
  with check (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "events: staff update"
  on shipment_events for update
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "events: staff delete"
  on shipment_events for delete
  using (exists (select 1 from profiles p where p.id = auth.uid()));


-- ============================================================
-- TABLE: quote_requests
-- ============================================================
create table quote_requests (
  id                  uuid        primary key default uuid_generate_v4(),
  company             text,
  contact_name        text        not null,
  contact_email       text        not null,
  contact_phone       text,
  origin_city         text        not null,
  destination_country text        not null,
  destination_city    text        not null,
  description         text        not null,
  pieces              integer,
  weight_kg           numeric(10,2),
  dimensions          text,
  declared_value      numeric(14,2),
  currency            text        not null default 'BRL',
  notes               text,
  created_at          timestamptz not null default now()
);

create index on quote_requests (created_at desc);

alter table quote_requests enable row level security;

-- Anyone can submit a quote (public form — no auth required)
create policy "quotes: public insert"
  on quote_requests for insert
  with check (true);

-- Only staff can read quote requests
create policy "quotes: staff select"
  on quote_requests for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));


-- ============================================================
-- TABLE: followers
-- ============================================================
create table followers (
  id               uuid        primary key default uuid_generate_v4(),
  shipment_id      uuid        not null references shipments(id) on delete cascade,
  email            text        not null,
  token            text        not null unique default encode(gen_random_bytes(24), 'hex'),
  confirmed_at     timestamptz,
  unsubscribed_at  timestamptz,
  created_at       timestamptz not null default now(),
  unique (shipment_id, email)
);

create index on followers (token);
create index on followers (shipment_id);

alter table followers enable row level security;

-- Anyone can subscribe to a shipment (no auth required)
create policy "followers: public insert"
  on followers for insert
  with check (true);

-- Staff can read all followers (for email notifications)
create policy "followers: staff select"
  on followers for select
  using (exists (select 1 from profiles p where p.id = auth.uid()));


-- ============================================================
-- TABLE: service_alerts
-- ============================================================
create table service_alerts (
  id          uuid        primary key default uuid_generate_v4(),
  message_pt  text        not null,
  message_en  text        not null,
  starts_at   timestamptz not null,
  expires_at  timestamptz not null,
  active      boolean     not null default true,
  created_by  uuid        references auth.users(id),
  created_at  timestamptz not null default now()
);

alter table service_alerts enable row level security;

-- Anyone can read alerts (shown in the public banner)
create policy "alerts: public select"
  on service_alerts for select
  using (true);

create policy "alerts: staff insert"
  on service_alerts for insert
  with check (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "alerts: staff update"
  on service_alerts for update
  using (exists (select 1 from profiles p where p.id = auth.uid()));

create policy "alerts: staff delete"
  on service_alerts for delete
  using (exists (select 1 from profiles p where p.id = auth.uid()));


-- ============================================================
-- SEQUENCE + FUNCTION: next_tracking_code
-- Generates codes in the format DCBR260001, DCBR260002 ...
-- The sequence is global (never resets) so codes are always unique.
-- ============================================================
create sequence if not exists tracking_code_seq start 1;

create or replace function next_tracking_code()
returns text
language plpgsql
security definer
as $$
declare
  year_part text  := to_char(now(), 'YY');
  seq_num   bigint := nextval('tracking_code_seq');
begin
  return 'DCBR' || year_part || lpad(seq_num::text, 4, '0');
end;
$$;


-- ============================================================
-- FUNCTION: get_shipment_by_code  (public — no sensitive fields)
-- Called by the public tracking page via supabase.rpc()
-- ============================================================
create or replace function get_shipment_by_code(p_code text)
returns json
language plpgsql
security definer
as $$
declare
  v_shipment shipments%rowtype;
  v_events   json;
begin
  select * into v_shipment
  from shipments
  where tracking_code = upper(trim(p_code));

  if not found then
    return json_build_object('found', false);
  end if;

  select json_agg(
    json_build_object(
      'status',      e.status,
      'location',    e.location,
      'note',        e.note,
      'happened_at', e.happened_at
    )
    order by e.happened_at asc
  )
  into v_events
  from shipment_events e
  where e.shipment_id = v_shipment.id;

  return json_build_object(
    'found',               true,
    'tracking_code',       v_shipment.tracking_code,
    'status',              v_shipment.status,
    'origin_city',         v_shipment.origin_city,
    'origin_country',      v_shipment.origin_country,
    'destination_city',    v_shipment.destination_city,
    'destination_country', v_shipment.destination_country,
    'pieces',              v_shipment.pieces,
    'events',              coalesce(v_events, '[]'::json)
  );
end;
$$;


-- ============================================================
-- FUNCTION: confirm_follower
-- Called by /api/confirm-follow?token=...
-- ============================================================
create or replace function confirm_follower(p_token text)
returns boolean
language plpgsql
security definer
as $$
begin
  update followers
  set confirmed_at = now()
  where token = p_token
    and confirmed_at is null;

  return found;
end;
$$;


-- ============================================================
-- FUNCTION: unsubscribe_follower
-- Called by /api/unsubscribe?token=...
-- ============================================================
create or replace function unsubscribe_follower(p_token text)
returns boolean
language plpgsql
security definer
as $$
begin
  update followers
  set unsubscribed_at = now()
  where token = p_token
    and unsubscribed_at is null;

  return found;
end;
$$;
