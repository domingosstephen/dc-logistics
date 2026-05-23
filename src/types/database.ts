export type ShipmentStatus =
  | "registered"
  | "documentation"
  | "awaiting_departure"
  | "in_transit"
  | "border_crossing"
  | "arrival_hub"
  | "out_for_delivery"
  | "delivered"
  | "on_hold"
  | "delayed";

export interface Shipment {
  id: string;
  tracking_code: string;
  status: ShipmentStatus;
  pet_name: string;
  pet_species: string;
  pet_breed: string | null;
  pet_photo_path: string | null;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  estimated_delivery: string | null;
  departure_date: string | null;
  departure_time: string | null;
  arrival_time: string | null;
  customer_name: string | null;
  customer_email: string | null;
  sender_name: string | null;
  sender_email: string | null;
  sender_phone: string | null;
  sender_address: string | null;
  receiver_name: string | null;
  receiver_email: string | null;
  receiver_phone: string | null;
  receiver_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShipmentEvent {
  id: string;
  shipment_id: string;
  status: ShipmentStatus;
  location: string | null;
  note: string | null;
  happened_at: string;
  created_at: string;
}

export interface Profile {
  id: string;
  role: "admin" | "staff";
}

export interface PublicShipment {
  tracking_code: string;
  status: ShipmentStatus;
  pet_name: string;
  pet_species: string;
  pet_breed: string | null;
  pet_photo_path: string | null;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  estimated_delivery: string | null;
  events: PublicShipmentEvent[];
}

export interface PublicShipmentEvent {
  status: ShipmentStatus;
  location: string | null;
  note: string | null;
  happened_at: string;
}

export interface QuoteRequest {
  id: string;
  pet_species: string;
  pet_breed: string | null;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  preferred_date: string | null;
  customer_name: string;
  customer_email: string;
  message: string | null;
  created_at: string;
}

// Supabase generated types placeholder
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
        Insert: Omit<ShipmentEvent, "id" | "created_at">;
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
        Update: Partial<Omit<QuoteRequest, "id" | "created_at">>;
      };
    };
    Functions: {
      get_shipment_by_code: {
        Args: { p_code: string };
        Returns: PublicShipment | null;
      };
    };
    Enums: {
      shipment_status: ShipmentStatus;
    };
  };
}
