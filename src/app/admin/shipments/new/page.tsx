"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { generateTrackingCode } from "@/lib/tracking-code";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const countries = [
  // Europe
  { label: "Italy", code: "IT" },
  { label: "Germany", code: "DE" },
  { label: "France", code: "FR" },
  { label: "Spain", code: "ES" },
  { label: "Austria", code: "AT" },
  { label: "Switzerland", code: "CH" },
  { label: "Netherlands", code: "NL" },
  { label: "Belgium", code: "BE" },
  { label: "Poland", code: "PL" },
  { label: "Czech Republic", code: "CZ" },
  { label: "Croatia", code: "HR" },
  { label: "Slovenia", code: "SI" },
  { label: "Hungary", code: "HU" },
  { label: "United Kingdom", code: "GB" },
  { label: "Portugal", code: "PT" },
  { label: "Romania", code: "RO" },
  { label: "Greece", code: "GR" },
  { label: "Bulgaria", code: "BG" },
  { label: "Turkey", code: "TR" },
  { label: "Cyprus", code: "CY" },
  // North America
  { label: "United States", code: "US" },
  { label: "Canada", code: "CA" },
  { label: "Mexico", code: "MX" },
  // Central America & Caribbean
  { label: "Costa Rica", code: "CR" },
  { label: "Panama", code: "PA" },
  { label: "Dominican Republic", code: "DO" },
  // South America
  { label: "Brazil", code: "BR" },
  { label: "Argentina", code: "AR" },
  { label: "Colombia", code: "CO" },
  { label: "Chile", code: "CL" },
  { label: "Peru", code: "PE" },
  { label: "Ecuador", code: "EC" },
  { label: "Uruguay", code: "UY" },
  { label: "Venezuela", code: "VE" },
  { label: "Paraguay", code: "PY" },
  { label: "Bolivia", code: "BO" },
];

export default function NewShipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [originCountry, setOriginCountry] = useState("IT");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createBrowserClient();
    const form = new FormData(e.currentTarget);

    const trackingCode = generateTrackingCode(originCountry);

    // Insert shipment
    const { data: shipment, error: insertError } = await supabase
      .from("shipments")
      .insert({
        tracking_code: trackingCode,
        status: "registered",
        pet_name: form.get("pet_name") as string,
        pet_species: form.get("pet_species") as string,
        pet_breed: (form.get("pet_breed") as string) || null,
        origin_city: form.get("origin_city") as string,
        origin_country: originCountry,
        destination_city: form.get("destination_city") as string,
        destination_country: form.get("destination_country") as string,
        estimated_delivery: (form.get("estimated_delivery") as string) || null,
        departure_date: (form.get("departure_date") as string) || null,
        departure_time: (form.get("departure_time") as string) || null,
        arrival_time: (form.get("arrival_time") as string) || null,
        sender_name: (form.get("sender_name") as string) || null,
        sender_email: (form.get("sender_email") as string) || null,
        sender_phone: (form.get("sender_phone") as string) || null,
        sender_address: (form.get("sender_address") as string) || null,
        receiver_name: (form.get("receiver_name") as string) || null,
        receiver_email: (form.get("receiver_email") as string) || null,
        receiver_phone: (form.get("receiver_phone") as string) || null,
        receiver_address: (form.get("receiver_address") as string) || null,
        customer_name: (form.get("sender_name") as string) || null,
        customer_email: (form.get("sender_email") as string) || null,
      })
      .select()
      .single();

    if (insertError || !shipment) {
      setError("Error creating shipment. Please try again.");
      setLoading(false);
      return;
    }

    // Upload photo if provided
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const path = `${shipment.id}/photo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("pet-photos")
        .upload(path, photoFile, { upsert: true });

      if (!uploadError) {
        await supabase
          .from("shipments")
          .update({ pet_photo_path: path })
          .eq("id", shipment.id);
      }
    }

    // Create initial event
    await supabase.from("shipment_events").insert({
      shipment_id: shipment.id,
      status: "registered",
      note: `${form.get("pet_name")} has been registered. Code: ${trackingCode}`,
      happened_at: new Date().toISOString(),
    });

    router.push(`/admin/shipments/${shipment.id}`);
  };

  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-pine-deep text-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-display text-xl font-semibold">
              WayTrasporto
            </Link>
            <span className="text-xs bg-honey/20 text-honey px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="text-sm text-pine hover:text-pine-deep mb-4 inline-block">
          ← Back to list
        </Link>

        <div className="bg-paper rounded-xl p-8">
          <h1 className="font-display text-2xl font-semibold text-ink mb-6">
            New Shipment
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pet info */}
            <fieldset>
              <legend className="text-sm font-medium text-ink/50 mb-3">Pet Information</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pet_name">Pet Name *</Label>
                  <Input id="pet_name" name="pet_name" required className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="pet_species">Species *</Label>
                  <select id="pet_species" name="pet_species" required className="mt-1.5 h-10 w-full rounded-lg border border-pine/20 bg-mist px-3 text-sm">
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="pet_breed">Breed</Label>
                  <Input id="pet_breed" name="pet_breed" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="pet_photo">Photo</Label>
                  <Input
                    id="pet_photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    className="mt-1.5 rounded-lg border-pine/20 bg-mist"
                  />
                </div>
              </div>
            </fieldset>

            {/* Route */}
            <fieldset>
              <legend className="text-sm font-medium text-ink/50 mb-3">Route</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin_city">Origin City *</Label>
                  <Input id="origin_city" name="origin_city" required className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="origin_country">Origin Country *</Label>
                  <select
                    id="origin_country"
                    name="origin_country"
                    required
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-pine/20 bg-mist px-3 text-sm"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="destination_city">Destination City *</Label>
                  <Input id="destination_city" name="destination_city" required className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="destination_country">Destination Country *</Label>
                  <select id="destination_country" name="destination_country" required className="mt-1.5 h-10 w-full rounded-lg border border-pine/20 bg-mist px-3 text-sm">
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="departure_date">Departure Date</Label>
                  <Input id="departure_date" name="departure_date" type="date" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="estimated_delivery">Estimated Delivery</Label>
                  <Input id="estimated_delivery" name="estimated_delivery" type="date" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="departure_time">Departure Time</Label>
                  <Input id="departure_time" name="departure_time" type="time" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="arrival_time">Arrival Time</Label>
                  <Input id="arrival_time" name="arrival_time" type="time" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
              </div>
            </fieldset>

            {/* Sender */}
            <fieldset>
              <legend className="text-sm font-medium text-ink/50 mb-3">Sender (shipping the pet)</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sender_name">Name</Label>
                  <Input id="sender_name" name="sender_name" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="sender_email">Email</Label>
                  <Input id="sender_email" name="sender_email" type="email" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="sender_phone">Phone</Label>
                  <Input id="sender_phone" name="sender_phone" type="tel" placeholder="+39 ..." className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="sender_address">Address</Label>
                  <Input id="sender_address" name="sender_address" placeholder="Street, city, postcode" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
              </div>
            </fieldset>

            {/* Receiver */}
            <fieldset>
              <legend className="text-sm font-medium text-ink/50 mb-3">Receiver (receiving the pet)</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receiver_name">Name</Label>
                  <Input id="receiver_name" name="receiver_name" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="receiver_email">Email</Label>
                  <Input id="receiver_email" name="receiver_email" type="email" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div>
                  <Label htmlFor="receiver_phone">Phone</Label>
                  <Input id="receiver_phone" name="receiver_phone" type="tel" placeholder="+49 ..." className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="receiver_address">Address</Label>
                  <Input id="receiver_address" name="receiver_address" placeholder="Street, city, postcode" className="mt-1.5 rounded-lg border-pine/20 bg-mist" />
                </div>
              </div>
            </fieldset>

            {error && <p className="text-sm text-[#C0563E]">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-pine text-paper hover:bg-pine-deep"
            >
              {loading ? "Creating..." : "Create Shipment"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
