"use server";

import { createServerClient } from "@/lib/supabase/server";

interface QuoteFormData {
  company?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  origin_city: string;
  dest_country: string;
  dest_city: string;
  description: string;
  pieces?: string;
  weight_kg?: string;
  dimensions?: string;
  declared_value?: string;
  currency?: string;
  notes?: string;
}

export async function submitQuote(data: QuoteFormData) {
  const supabase = createServerClient();

  const { error } = await supabase.from("quote_requests").insert({
    company: data.company || null,
    contact_name: data.contact_name,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone || null,
    origin_city: data.origin_city,
    destination_country: data.dest_country,
    destination_city: data.dest_city,
    description: data.description,
    pieces: data.pieces ? parseInt(data.pieces) : null,
    weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : null,
    dimensions: data.dimensions || null,
    declared_value: data.declared_value ? parseFloat(data.declared_value) : null,
    currency: data.currency || "BRL",
    notes: data.notes || null,
  });

  if (error) {
    return { success: false };
  }

  return { success: true };
}
