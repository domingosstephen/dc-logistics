"use server";

import { createServiceClient } from "@/lib/supabase/server";

interface QuoteFormData {
  pet_species: string;
  pet_breed: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  preferred_date: string;
  customer_name: string;
  customer_email: string;
  message: string;
}

export async function submitQuote(data: QuoteFormData) {
  const supabase = createServiceClient();

  const { error } = await supabase.from("quote_requests").insert({
    pet_species: data.pet_species,
    pet_breed: data.pet_breed || null,
    origin_city: data.origin_city,
    origin_country: data.origin_country,
    destination_city: data.destination_city,
    destination_country: data.destination_country,
    preferred_date: data.preferred_date || null,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    message: data.message || null,
  });

  if (error) {
    return { success: false, error: "Si e verificato un errore. Riprova." };
  }

  return { success: true };
}
