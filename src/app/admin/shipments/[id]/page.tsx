"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Shipment, ShipmentEvent, ShipmentStatus } from "@/types/database";

const allStatuses: ShipmentStatus[] = [
  "registered", "documentation", "awaiting_departure", "in_transit",
  "border_crossing", "arrival_hub", "out_for_delivery", "delivered",
  "on_hold", "delayed",
];

export default function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<ShipmentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // New event form
  const [newStatus, setNewStatus] = useState<ShipmentStatus>("in_transit");
  const [newLocation, setNewLocation] = useState("");
  const [newNote, setNewNote] = useState("");
  const [posting, setPosting] = useState(false);

  // Photo upload
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const [{ data: s }, { data: e }] = await Promise.all([
      supabase.from("shipments").select("*").eq("id", id).single(),
      supabase.from("shipment_events").select("*").eq("shipment_id", id).order("happened_at", { ascending: true }),
    ]);
    setShipment(s);
    setEvents(e || []);
    setLoading(false);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);

    // Insert event
    await supabase.from("shipment_events").insert({
      shipment_id: id,
      status: newStatus,
      location: newLocation || null,
      note: newNote || null,
      happened_at: new Date().toISOString(),
    });

    // Update shipment status
    await supabase
      .from("shipments")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    setNewLocation("");
    setNewNote("");
    setPosting(false);
    fetchData();
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || !shipment) return;
    setUploading(true);
    const ext = photoFile.name.split(".").pop();
    const path = `${shipment.id}/photo.${ext}`;

    await supabase.storage.from("pet-photos").upload(path, photoFile, { upsert: true });
    await supabase.from("shipments").update({ pet_photo_path: path }).eq("id", shipment.id);

    setPhotoFile(null);
    setUploading(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <p className="text-ink/40">Loading...</p>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <p className="text-ink/40">Shipment not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-pine-deep text-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-display text-xl font-semibold">WayTrasporto</Link>
            <span className="text-xs bg-honey/20 text-honey px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="text-sm text-pine hover:text-pine-deep mb-4 inline-block">
          ← Back to list
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipment info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-paper rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="font-display text-2xl font-semibold text-ink">
                  {shipment.pet_name}
                </h1>
                <StatusBadge status={shipment.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-ink/40">Code</p>
                  <p className="font-mono text-pine font-medium">{shipment.tracking_code}</p>
                </div>
                <div>
                  <p className="text-ink/40">Species / Breed</p>
                  <p>{shipment.pet_species} {shipment.pet_breed && `- ${shipment.pet_breed}`}</p>
                </div>
                <div>
                  <p className="text-ink/40">Route</p>
                  <p>{shipment.origin_city}, {shipment.origin_country} → {shipment.destination_city}, {shipment.destination_country}</p>
                </div>
                <div>
                  <p className="text-ink/40">Estimated Delivery</p>
                  <p>{shipment.estimated_delivery ? new Date(shipment.estimated_delivery).toLocaleDateString("en-GB") : "—"}</p>
                </div>
                <div>
                  <p className="text-ink/40">Sender</p>
                  <p>{shipment.sender_name || "—"}</p>
                  {shipment.sender_phone && <p className="text-xs text-ink/40 mt-0.5">{shipment.sender_phone}</p>}
                  {shipment.sender_email && <p className="text-xs text-ink/40">{shipment.sender_email}</p>}
                  {shipment.sender_address && <p className="text-xs text-ink/40">{shipment.sender_address}</p>}
                </div>
                <div>
                  <p className="text-ink/40">Receiver</p>
                  <p>{shipment.receiver_name || "—"}</p>
                  {shipment.receiver_phone && <p className="text-xs text-ink/40 mt-0.5">{shipment.receiver_phone}</p>}
                  {shipment.receiver_email && <p className="text-xs text-ink/40">{shipment.receiver_email}</p>}
                  {shipment.receiver_address && <p className="text-xs text-ink/40">{shipment.receiver_address}</p>}
                </div>
              </div>

              {/* Photo */}
              <div className="mt-6 pt-4 border-t border-pine/5">
                <p className="text-sm text-ink/40 mb-2">Pet Photo</p>
                <div className="flex items-end gap-4">
                  {shipment.pet_photo_path ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-photos/${shipment.pet_photo_path}`}
                      alt={shipment.pet_name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-mist flex items-center justify-center text-ink/20 text-xs">
                      No photo
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                      className="rounded-lg border-pine/20 bg-mist text-xs"
                    />
                    {photoFile && (
                      <Button
                        onClick={handlePhotoUpload}
                        disabled={uploading}
                        size="sm"
                        className="mt-2 bg-pine text-paper hover:bg-pine-deep rounded-lg text-xs"
                      >
                        {uploading ? "Uploading..." : "Upload Photo"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Event timeline */}
            <div className="bg-paper rounded-xl p-6">
              <h2 className="font-display text-lg font-semibold text-ink mb-4">
                Event Timeline
              </h2>

              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex gap-3 text-sm">
                    <div className="w-3 h-3 rounded-full bg-pine mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={event.status} />
                        {event.location && (
                          <span className="text-xs text-ink/40">{event.location}</span>
                        )}
                        <span className="text-xs text-ink/30">
                          {new Date(event.happened_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {event.note && (
                        <p className="text-ink/60 mt-1">{event.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add event sidebar */}
          <div>
            <div className="bg-paper rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-lg font-semibold text-ink mb-4">
                Add Update
              </h2>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <Label htmlFor="event_status">Status</Label>
                  <select
                    id="event_status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-pine/20 bg-mist px-3 text-sm"
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="event_location">Location</Label>
                  <Input
                    id="event_location"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Milan, IT"
                    className="mt-1.5 rounded-lg border-pine/20 bg-mist"
                  />
                </div>
                <div>
                  <Label htmlFor="event_note">Note (public-facing)</Label>
                  <Textarea
                    id="event_note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Note visible to the customer..."
                    rows={3}
                    className="mt-1.5 rounded-lg border-pine/20 bg-mist resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={posting}
                  className="w-full bg-pine text-paper hover:bg-pine-deep rounded-lg"
                >
                  {posting ? "Publishing..." : "Publish Update"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
