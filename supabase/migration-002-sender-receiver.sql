-- Add sender and receiver fields to shipments
-- Run this in Supabase SQL Editor

ALTER TABLE public.shipments
  -- Sender (person shipping the pet)
  ADD COLUMN sender_name text,
  ADD COLUMN sender_email text,
  ADD COLUMN sender_phone text,
  -- Receiver (person receiving the pet)
  ADD COLUMN receiver_name text,
  ADD COLUMN receiver_email text,
  ADD COLUMN receiver_phone text;
