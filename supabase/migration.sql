-- PetVoyage Database Migration
-- Run this in Supabase SQL Editor

-- ENUM for journey stages
create type shipment_status as enum (
  'registered',
  'documentation',
  'awaiting_departure',
  'in_transit',
  'border_crossing',
  'arrival_hub',
  'out_for_delivery',
  'delivered',
  'on_hold',
  'delayed'
);

-- Shipments table
create table public.shipments (
  id                uuid primary key default gen_random_uuid(),
  tracking_code     text unique not null,
  status            shipment_status not null default 'registered',
  pet_name          text not null,
  pet_species       text not null default 'dog',
  pet_breed         text,
  pet_photo_path    text,
  origin_city       text not null,
  origin_country    text not null,
  destination_city  text not null,
  destination_country text not null,
  estimated_delivery date,
  customer_name     text,
  customer_email    text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Shipment events table
create table public.shipment_events (
  id            uuid primary key default gen_random_uuid(),
  shipment_id   uuid not null references public.shipments(id) on delete cascade,
  status        shipment_status not null,
  location      text,
  note          text,
  happened_at   timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create index on public.shipment_events (shipment_id, happened_at desc);

-- Profiles table
create table public.profiles (
  id    uuid primary key references auth.users(id) on delete cascade,
  role  text not null default 'staff'
);

-- Quote requests table
create table public.quote_requests (
  id                  uuid primary key default gen_random_uuid(),
  pet_species         text not null,
  pet_breed           text,
  origin_city         text not null,
  origin_country      text not null,
  destination_city    text not null,
  destination_country text not null,
  preferred_date      date,
  customer_name       text not null,
  customer_email      text not null,
  message             text,
  created_at          timestamptz not null default now()
);

-- ============================================
-- Row Level Security
-- ============================================

alter table public.shipments       enable row level security;
alter table public.shipment_events enable row level security;
alter table public.profiles        enable row level security;
alter table public.quote_requests  enable row level security;

-- Staff policies for shipments
create policy "staff read shipments" on public.shipments
  for select to authenticated using (true);
create policy "staff write shipments" on public.shipments
  for insert to authenticated with check (true);
create policy "staff update shipments" on public.shipments
  for update to authenticated using (true) with check (true);
create policy "staff delete shipments" on public.shipments
  for delete to authenticated using (true);

-- Staff policies for events
create policy "staff read events" on public.shipment_events
  for select to authenticated using (true);
create policy "staff write events" on public.shipment_events
  for insert to authenticated with check (true);
create policy "staff update events" on public.shipment_events
  for update to authenticated using (true) with check (true);

-- Profile policies
create policy "self read profile" on public.profiles
  for select to authenticated using (id = auth.uid());

-- Quote requests: anon can insert, staff can read
create policy "anon insert quotes" on public.quote_requests
  for insert to anon with check (true);
create policy "auth insert quotes" on public.quote_requests
  for insert to authenticated with check (true);
create policy "staff read quotes" on public.quote_requests
  for select to authenticated using (true);

-- ============================================
-- Public tracking RPC (the only public read path)
-- ============================================

create or replace function public.get_shipment_by_code(p_code text)
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'tracking_code', s.tracking_code,
    'status', s.status,
    'pet_name', s.pet_name,
    'pet_species', s.pet_species,
    'pet_breed', s.pet_breed,
    'pet_photo_path', s.pet_photo_path,
    'origin_city', s.origin_city,
    'origin_country', s.origin_country,
    'destination_city', s.destination_city,
    'destination_country', s.destination_country,
    'estimated_delivery', s.estimated_delivery,
    'events', coalesce((
      select json_agg(json_build_object(
        'status', e.status, 'location', e.location,
        'note', e.note, 'happened_at', e.happened_at
      ) order by e.happened_at asc)
      from public.shipment_events e where e.shipment_id = s.id
    ), '[]'::json)
  )
  from public.shipments s
  where upper(s.tracking_code) = upper(trim(p_code))
  limit 1;
$$;

grant execute on function public.get_shipment_by_code(text) to anon, authenticated;

-- ============================================
-- Enable Realtime on shipment_events
-- ============================================

alter publication supabase_realtime add table public.shipment_events;

-- ============================================
-- Storage bucket for pet photos
-- ============================================
-- Create bucket 'pet-photos' via Supabase dashboard with public access

-- ============================================
-- Seed data (3 demo shipments)
-- ============================================

-- Demo 1: Luna (delivered)
insert into public.shipments (id, tracking_code, status, pet_name, pet_species, pet_breed, origin_city, origin_country, destination_city, destination_country, estimated_delivery, customer_name, customer_email)
values ('11111111-1111-1111-1111-111111111111', 'IT-7H4K-2Q', 'delivered', 'Luna', 'dog', 'Golden Retriever', 'Milano', 'IT', 'Berlino', 'DE', '2026-05-20', 'Maria Rossi', 'maria@example.com');

insert into public.shipment_events (shipment_id, status, location, note, happened_at) values
('11111111-1111-1111-1111-111111111111', 'registered', 'Milano, IT', 'Luna e stata registrata. Codice: IT-7H4K-2Q', '2026-05-15 09:00:00+02'),
('11111111-1111-1111-1111-111111111111', 'documentation', 'Milano, IT', 'Documenti e controlli veterinari in preparazione.', '2026-05-16 10:00:00+02'),
('11111111-1111-1111-1111-111111111111', 'awaiting_departure', 'Milano, IT', 'Luna e pronta nel trasportino. Tutto ok!', '2026-05-17 07:00:00+02'),
('11111111-1111-1111-1111-111111111111', 'in_transit', 'Brennero, IT/AT', 'Luna e in viaggio! Sta bene e riposa.', '2026-05-17 14:00:00+02'),
('11111111-1111-1111-1111-111111111111', 'border_crossing', 'Innsbruck, AT', 'Passaporto EU verificato al confine.', '2026-05-18 08:00:00+02'),
('11111111-1111-1111-1111-111111111111', 'arrival_hub', 'Monaco, DE', 'Luna e arrivata all hub e si riposa.', '2026-05-19 12:00:00+02'),
('11111111-1111-1111-1111-111111111111', 'out_for_delivery', 'Monaco, DE', 'Ultima tappa verso Berlino!', '2026-05-20 08:00:00+02'),
('11111111-1111-1111-1111-111111111111', 'delivered', 'Berlino, DE', 'Luna e stata riunita con la famiglia! Benvenuta a casa!', '2026-05-20 16:00:00+02');

-- Demo 2: Max (in transit)
insert into public.shipments (id, tracking_code, status, pet_name, pet_species, pet_breed, origin_city, origin_country, destination_city, destination_country, estimated_delivery, customer_name, customer_email)
values ('22222222-2222-2222-2222-222222222222', 'DE-9M3P-5X', 'in_transit', 'Max', 'dog', 'Pastore Tedesco', 'Roma', 'IT', 'Monaco', 'DE', '2026-05-25', 'Thomas Mueller', 'thomas@example.com');

insert into public.shipment_events (shipment_id, status, location, note, happened_at) values
('22222222-2222-2222-2222-222222222222', 'registered', 'Roma, IT', 'Max e stato registrato. Codice: DE-9M3P-5X', '2026-05-20 10:00:00+02'),
('22222222-2222-2222-2222-222222222222', 'documentation', 'Roma, IT', 'Vaccinazioni e microchip verificati.', '2026-05-21 09:00:00+02'),
('22222222-2222-2222-2222-222222222222', 'awaiting_departure', 'Roma, IT', 'Max e pronto! Trasportino comodo e preparato.', '2026-05-22 06:00:00+02'),
('22222222-2222-2222-2222-222222222222', 'in_transit', 'Firenze, IT', 'Max e in viaggio! Prima sosta a Firenze. Sta benissimo.', '2026-05-22 12:00:00+02');

-- Demo 3: Milo (registered)
insert into public.shipments (id, tracking_code, status, pet_name, pet_species, pet_breed, origin_city, origin_country, destination_city, destination_country, estimated_delivery, customer_name, customer_email)
values ('33333333-3333-3333-3333-333333333333', 'FR-4T8W-7J', 'registered', 'Milo', 'dog', 'Bulldog Francese', 'Parigi', 'FR', 'Milano', 'IT', '2026-06-01', 'Sophie Dubois', 'sophie@example.com');

insert into public.shipment_events (shipment_id, status, location, note, happened_at) values
('33333333-3333-3333-3333-333333333333', 'registered', 'Parigi, FR', 'Milo e stato registrato. Codice: FR-4T8W-7J', '2026-05-22 08:00:00+02');
