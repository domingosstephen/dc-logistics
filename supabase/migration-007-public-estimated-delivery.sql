-- migration-007 — expose estimated_delivery_date in the public tracking RPC

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
    'found',                    true,
    'tracking_code',            v_shipment.tracking_code,
    'status',                   v_shipment.status,
    'origin_city',              v_shipment.origin_city,
    'origin_country',           v_shipment.origin_country,
    'destination_city',         v_shipment.destination_city,
    'destination_country',      v_shipment.destination_country,
    'pieces',                   v_shipment.pieces,
    'estimated_delivery_date',  v_shipment.estimated_delivery_date,
    'events',                   coalesce(v_events, '[]'::json)
  );
end;
$$;
