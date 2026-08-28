// Rail states — 8 main stages
export type RailStatus =
  | "registered"
  | "received"
  | "processing"
  | "export_clearance"
  | "in_transit"
  | "import_clearance"
  | "out_for_delivery"
  | "delivered";

// Off-rail exception states
export type ExceptionStatus = "on_hold" | "returned" | "cancelled";

export type ShipmentStatus = RailStatus | ExceptionStatus;

// Rail stage order (for the manifest rail component)
export const RAIL_STAGES: RailStatus[] = [
  "registered",
  "received",
  "processing",
  "export_clearance",
  "in_transit",
  "import_clearance",
  "out_for_delivery",
  "delivered",
];

export const EXCEPTION_STATUSES: ExceptionStatus[] = [
  "on_hold",
  "returned",
  "cancelled",
];

export function isExceptionStatus(s: ShipmentStatus): s is ExceptionStatus {
  return EXCEPTION_STATUSES.includes(s as ExceptionStatus);
}

// Full shipment row (admin / client auth view)
export interface Shipment {
  id: string;
  tracking_code: string;
  status: ShipmentStatus;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  description: string;
  pieces: number;
  weight_kg: number | null;
  dimensions: string | null;
  declared_value: number | null;
  currency: string;
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_address: string | null;
  client_name: string | null;
  client_email: string | null;
  carrier_ref: string | null;
  shipping_date: string | null;
  estimated_delivery_date: string | null;
  created_at: string;
  updated_at: string;
}

// Event row (staff view includes audit columns)
export interface ShipmentEvent {
  id: string;
  shipment_id: string;
  status: ShipmentStatus;
  location: string | null;
  note: string | null;
  happened_at: string;
  created_at: string;
  updated_at: string | null;
  updated_by: string | null;
}

// Public-facing shipment — NEVER include sensitive fields
export interface PublicShipment {
  found: true;
  tracking_code: string;
  status: ShipmentStatus;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  pieces: number;
  events: PublicShipmentEvent[];
}

export interface PublicShipmentNotFound {
  found: false;
}

export type PublicShipmentResult = PublicShipment | PublicShipmentNotFound;

export interface PublicShipmentEvent {
  status: ShipmentStatus;
  location: string | null;
  note: string | null;
  happened_at: string;
}

export interface Profile {
  id: string;
  role: "staff" | "admin";
}

export interface QuoteRequest {
  id: string;
  company: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  origin_city: string;
  destination_country: string;
  destination_city: string;
  description: string;
  pieces: number | null;
  weight_kg: number | null;
  dimensions: string | null;
  declared_value: number | null;
  currency: string;
  notes: string | null;
  created_at: string;
}

export interface Follower {
  id: string;
  shipment_id: string;
  email: string;
  token: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
}

export interface ServiceAlert {
  id: string;
  message_pt: string;
  message_en: string;
  starts_at: string;
  expires_at: string;
  active: boolean;
  created_by: string | null;
  created_at: string;
}

// Supabase generated-types placeholder
export interface Database {
  public: {
    Tables: {
      shipments: {
        Row: Shipment;
        Insert: Omit<Shipment, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Shipment, "id" | "created_at">>;
      };
      shipment_events: {
        Row: ShipmentEvent;
        Insert: Omit<ShipmentEvent, "id" | "created_at" | "updated_at" | "updated_by">;
        Update: Partial<Omit<ShipmentEvent, "id" | "created_at">>;
      };
      profiles: {
        Row: Profile;
        Insert: Profile;
        Update: Partial<Profile>;
      };
      quote_requests: {
        Row: QuoteRequest;
        Insert: Omit<QuoteRequest, "id" | "created_at">;
        Update: never;
      };
      followers: {
        Row: Follower;
        Insert: Omit<Follower, "id" | "token" | "confirmed_at" | "unsubscribed_at" | "created_at">;
        Update: Pick<Follower, "confirmed_at" | "unsubscribed_at">;
      };
      service_alerts: {
        Row: ServiceAlert;
        Insert: Omit<ServiceAlert, "id" | "created_at">;
        Update: Partial<Omit<ServiceAlert, "id" | "created_at">>;
      };
    };
    Functions: {
      get_shipment_by_code: {
        Args: { p_code: string };
        Returns: PublicShipmentResult;
      };
      next_tracking_code: {
        Args: Record<never, never>;
        Returns: string;
      };
      confirm_follower: {
        Args: { p_token: string };
        Returns: boolean;
      };
      unsubscribe_follower: {
        Args: { p_token: string };
        Returns: boolean;
      };
    };
    Enums: {
      shipment_status: ShipmentStatus;
    };
  };
}
