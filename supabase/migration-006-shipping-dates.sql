-- migration-006 — add shipping_date and estimated_delivery_date to shipments

ALTER TABLE public.shipments
  ADD COLUMN IF NOT EXISTS shipping_date          date,
  ADD COLUMN IF NOT EXISTS estimated_delivery_date date;
