"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { ManifestRail } from "@/components/tracking/manifest-rail";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  RAIL_STAGES,
  EXCEPTION_STATUSES,
  type Shipment,
  type ShipmentEvent,
  type ShipmentStatus,
  type RailStatus,
} from "@/types/database";

const ALL_STATUSES: ShipmentStatus[] = [...RAIL_STAGES, ...EXCEPTION_STATUSES];

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  registered: "Registrado",
  received: "Recebido no armazém",
  processing: "Em processamento",
  export_clearance: "Desembaraço de exportação",
  in_transit: "Em trânsito internacional",
  import_clearance: "Desembaraço no destino",
  out_for_delivery: "Saiu para entrega",
  delivered: "Entregue",
  on_hold: "Retido",
  returned: "Devolvido",
  cancelled: "Cancelado",
};

export default function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<ShipmentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Date edit state
  const [shippingDate, setShippingDate] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [savingDates, setSavingDates] = useState(false);
  const [datesSuccess, setDatesSuccess] = useState(false);

  // Add-event form state
  const [newStatus, setNewStatus] = useState<ShipmentStatus>("in_transit");
  const [newLocation, setNewLocation] = useState("");
  const [newDatetime, setNewDatetime] = useState(() =>
    new Date().toISOString().slice(0, 16)
  );
  const [newNote, setNewNote] = useState("");
  const [posting, setPosting] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    const [{ data: s }, { data: e }] = await Promise.all([
      supabase.from("shipments").select("*").eq("id", id).single(),
      supabase
        .from("shipment_events")
        .select("*")
        .eq("shipment_id", id)
        .order("happened_at", { ascending: true }),
    ]);
    const ship = s as Shipment | null;
    setShipment(ship);
    if (ship) {
      setShippingDate(ship.shipping_date?.slice(0, 10) ?? "");
      setEstimatedDeliveryDate(ship.estimated_delivery_date?.slice(0, 10) ?? "");
    }
    setEvents((e ?? []) as ShipmentEvent[]);
    setLoading(false);
  }

  async function handleSaveDates(e: React.FormEvent) {
    e.preventDefault();
    setSavingDates(true);
    setDatesSuccess(false);
    await supabase
      .from("shipments")
      .update({
        shipping_date: shippingDate || null,
        estimated_delivery_date: estimatedDeliveryDate || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    setSavingDates(false);
    setDatesSuccess(true);
    fetchData();
  }

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    setAddSuccess(false);

    const happened_at = newDatetime
      ? new Date(newDatetime).toISOString()
      : new Date().toISOString();

    await supabase.from("shipment_events").insert({
      shipment_id: id,
      status: newStatus,
      location: newLocation || null,
      note: newNote || null,
      happened_at,
    });

    // Update shipment's current status to the new event's status
    await supabase
      .from("shipments")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    setNewLocation("");
    setNewNote("");
    setNewDatetime(new Date().toISOString().slice(0, 16));
    setPosting(false);
    setAddSuccess(true);
    fetchData();
  }

  async function handleDeleteEvent(eventId: string) {
    if (!window.confirm("Apagar este registro? O cliente pode já ter visto esta etapa.")) return;
    await supabase.from("shipment_events").delete().eq("id", eventId);
    fetchData();
  }

  async function handleDeleteShipment() {
    if (!shipment) return;
    if (!window.confirm(`Apagar envio ${shipment.tracking_code}? Esta ação não pode ser desfeita.`)) return;
    await supabase.from("shipments").delete().eq("id", shipment.id);
    router.push("/admin");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-steel">Carregando…</p>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-steel">Envio não encontrado.</p>
      </div>
    );
  }

  const railLabels = Object.fromEntries(
    RAIL_STAGES.map((s) => [s, STATUS_LABELS[s]])
  ) as Record<RailStatus, string>;

  const railTimestamps: Partial<Record<RailStatus, string>> = {};
  for (const ev of events) {
    if (RAIL_STAGES.includes(ev.status as RailStatus)) {
      railTimestamps[ev.status as RailStatus] = new Date(ev.happened_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin nav */}
      <header className="bg-deep text-white border-b border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 py-3 flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-semibold">
            DC Logistics Brasil
          </Link>
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Admin</span>
          <nav className="flex items-center gap-4 text-sm ml-4">
            <Link href="/admin" className="text-white/60 hover:text-white transition-colors">Envios</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 md:px-8 py-8">
        <Link href="/admin" className="text-sm text-marine hover:underline mb-6 inline-block">
          ← Envios
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Left — shipment detail */}
          <div className="space-y-6">
            {/* Manifest rail */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <div className="flex flex-wrap items-baseline gap-4 mb-6">
                <h1 className="font-mono text-lg text-deep">{shipment.tracking_code}</h1>
                <span className="text-sm text-steel">
                  {shipment.origin_city}, {shipment.origin_country} →{" "}
                  {shipment.destination_city}, {shipment.destination_country}
                </span>
              </div>
              <ManifestRail
                status={shipment.status}
                labels={railLabels}
                timestamps={railTimestamps}
                variant="full"
              />
            </div>

            {/* Shipment facts */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h2 className="font-semibold text-ink mb-4">Dados do envio</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                {[
                  ["Descrição", shipment.description],
                  ["Volumes", String(shipment.pieces)],
                  ["Peso (kg)", shipment.weight_kg?.toString() ?? "—"],
                  ["Dimensões", shipment.dimensions ?? "—"],
                  ["Valor declarado", shipment.declared_value ? `${shipment.currency} ${shipment.declared_value}` : "—"],
                  ["Ref. transportadora", shipment.carrier_ref ?? "—"],
                  ["Data de envio", shipment.shipping_date ? new Date(shipment.shipping_date + "T12:00:00").toLocaleDateString("pt-BR") : "—"],
                  ["Prazo estimado de entrega", shipment.estimated_delivery_date ? new Date(shipment.estimated_delivery_date + "T12:00:00").toLocaleDateString("pt-BR") : "—"],
                  ["Cliente", shipment.client_name ?? "—"],
                  ["E-mail cliente", shipment.client_email ?? "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[11px] font-mono tracking-widest text-steel uppercase mb-0.5">{label}</p>
                    <p className="text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient — shown to staff only */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h2 className="font-semibold text-ink mb-4">Destinatário</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {[
                  ["Nome", shipment.recipient_name ?? "—"],
                  ["Telefone", shipment.recipient_phone ?? "—"],
                  ["Endereço", shipment.recipient_address ?? "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[11px] font-mono tracking-widest text-steel uppercase mb-0.5">{label}</p>
                    <p className="text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Event history with edit/delete */}
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-ink">Histórico</h2>
                <p className="text-xs text-steel">
                  Editar ou apagar um registro muda o que o cliente já viu. Toda alteração fica registrada com autor e data.
                </p>
              </div>
              {events.length === 0 ? (
                <p className="px-6 py-8 text-sm text-steel">Nenhuma atualização ainda.</p>
              ) : (
                <div className="divide-y divide-border">
                  {[...events].reverse().map((ev) => (
                    <div key={ev.id} className="px-6 py-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-medium text-ink">{STATUS_LABELS[ev.status]}</span>
                          {ev.location && <span className="text-sm text-steel">{ev.location}</span>}
                          <time className="font-mono text-xs text-steel">
                            {new Date(ev.happened_at).toLocaleString("pt-BR", {
                              day: "2-digit", month: "2-digit", year: "2-digit",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </time>
                          {ev.updated_at && (
                            <span className="text-[10px] font-mono text-steel/60">
                              editado {new Date(ev.updated_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit" })}
                            </span>
                          )}
                        </div>
                        {ev.note && <p className="text-sm text-steel mt-1">{ev.note}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="text-xs text-steel hover:text-destructive transition-colors shrink-0 mt-0.5"
                        aria-label="Apagar registro"
                      >
                        Apagar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex gap-4 text-sm">
              <a href={`/admin/shipments/${id}/slip`} target="_blank" className="text-marine hover:underline">
                Etiqueta interna →
              </a>
              <button
                onClick={handleDeleteShipment}
                className="text-destructive hover:underline ml-auto"
              >
                Apagar envio
              </button>
            </div>
          </div>

          {/* Right — Add update (the primary daily action) */}
          <div>
            <div className="bg-surface rounded-lg border border-border p-6 sticky top-6">
              <h2 className="font-display text-xl font-semibold text-deep mb-6">
                Adicionar atualização
              </h2>

              {addSuccess && (
                <div className="mb-4 rounded-md bg-muted px-4 py-3 text-sm text-ink">
                  Atualização adicionada. O cliente foi notificado.
                </div>
              )}

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <Label htmlFor="event_status" className="text-sm text-ink mb-1.5 block">
                    Etapa *
                  </Label>
                  <select
                    id="event_status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="event_location" className="text-sm text-ink mb-1.5 block">
                    Local
                  </Label>
                  <Input
                    id="event_location"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="ex: GRU, SP"
                    className="h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="event_datetime" className="text-sm text-ink mb-1.5 block">
                    Data e hora *
                  </Label>
                  <Input
                    id="event_datetime"
                    type="datetime-local"
                    value={newDatetime}
                    onChange={(e) => setNewDatetime(e.target.value)}
                    className="h-10"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="event_note" className="text-sm text-ink mb-1.5 block">
                    Observação (opcional)
                  </Label>
                  <Textarea
                    id="event_note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="mt-1 text-xs text-steel">
                    Fica visível para o cliente. Não escreva nada aqui que o cliente não deva ler.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={posting}
                  className="w-full bg-marine text-white hover:bg-marine/90 h-10"
                >
                  {posting ? "Salvando…" : "Adicionar atualização"}
                </Button>
              </form>

              {/* Edit dates */}
              <form onSubmit={handleSaveDates} className="mt-6 pt-6 border-t border-border space-y-4">
                <h3 className="font-semibold text-ink text-sm">Datas</h3>
                {datesSuccess && (
                  <p className="text-xs text-marine">Datas salvas.</p>
                )}
                <div>
                  <Label htmlFor="shipping_date_edit" className="text-sm text-ink mb-1.5 block">
                    Data de envio
                  </Label>
                  <Input
                    id="shipping_date_edit"
                    type="date"
                    value={shippingDate}
                    onChange={(e) => setShippingDate(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="est_delivery_edit" className="text-sm text-ink mb-1.5 block">
                    Prazo estimado de entrega
                  </Label>
                  <Input
                    id="est_delivery_edit"
                    type="date"
                    value={estimatedDeliveryDate}
                    onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                    className="h-10"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={savingDates}
                  variant="outline"
                  className="w-full h-10"
                >
                  {savingDates ? "Salvando…" : "Salvar datas"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
