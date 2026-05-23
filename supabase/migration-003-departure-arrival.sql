-- Add departure/arrival date and time fields
-- Run this in Supabase SQL Editor

ALTER TABLE public.shipments
  ADD COLUMN departure_date date,
  ADD COLUMN departure_time text,
  ADD COLUMN arrival_time text;
