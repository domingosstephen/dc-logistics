-- Update get_shipment_by_code to include receiver name and address
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
    'receiver_name', s.receiver_name,
    'receiver_address', s.receiver_address,
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
