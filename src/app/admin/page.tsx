"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { ManifestRail } from "@/components/tracking/manifest-rail";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  RAIL_STAGES,
  EXCEPTION_STATUSES,
  type Shipment,
  type ShipmentStatus,
  type RailStatus,
} from "@/types/database";

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  registered: "Registrado",
  received: "Recebido",
  processing: "Processamento",
  export_clearance: "Desembaraço exp.",
  in_transit: "Em trânsito",
  import_clearance: "Desembaraço dest.",
  out_for_delivery: "Saiu p/ entrega",
  delivered: "Entregue",
  on_hold: "Retido",
  returned: "Devolvido",
  cancelled: "Cancelado",
};

const ALL_STATUSES: ShipmentStatus[] = [...RAIL_STAGES, ...EXCEPTION_STATUSES];

const railLabels = Object.fromEntries(
  RAIL_STAGES.map((s) => [s, STATUS_LABELS[s]])
) as Record<RailStatus, string>;

export default function AdminDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  async function fetchShipments() {
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("shipments")
      .select("*")
      .order("updated_at", { ascending: false });
    setShipments((data ?? []) as Shipment[]);
    setLoading(false);
  }

  const filtered = shipments.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      s.tracking_code.toLowerCase().includes(q) ||
      (s.client_name?.toLowerCase().includes(q) ?? false) ||
      (s.destination_city?.toLowerCase().includes(q) ?? false);
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleLogout() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-deep text-white border-b border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-display text-lg font-semibold">DC Logistics Brasil</span>
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/pt" className="text-white/60 hover:text-white transition-colors">Site</Link>
            <button onClick={handleLogout} className="text-white/60 hover:text-white transition-colors">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 md:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-2xl font-semibold text-deep">Envios</h1>
          <div className="flex items-center gap-2">
            <Link href="/admin/alerts">
              <Button variant="outline" className="h-9 px-4 text-sm border-border text-steel hover:text-ink">
                Alertas
              </Button>
            </Link>
            <Link href="/admin/shipments/new">
              <Button className="bg-marine text-white hover:bg-marine/90 h-9 px-4 text-sm">
                + Novo envio
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Input
            placeholder="Buscar por número, cliente ou destino…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-64 text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                statusFilter === "all" ? "bg-deep text-white border-deep" : "border-border text-steel hover:border-steel"
              }`}
            >
              Todas
            </button>
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                  statusFilter === s ? "bg-deep text-white border-deep" : "border-border text-steel hover:border-steel"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-steel text-sm">Carregando…</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-steel text-sm">Nenhum envio encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-b-deep text-left">
                    <th className="px-4 py-3 font-mono text-[11px] tracking-widest text-steel uppercase whitespace-nowrap">Número</th>
                    <th className="px-4 py-3 font-mono text-[11px] tracking-widest text-steel uppercase whitespace-nowrap">Cliente</th>
                    <th className="px-4 py-3 font-mono text-[11px] tracking-widest text-steel uppercase whitespace-nowrap">Destino</th>
                    <th className="px-4 py-3 font-mono text-[11px] tracking-widest text-steel uppercase whitespace-nowrap">Etapa</th>
                    <th className="px-4 py-3 font-mono text-[11px] tracking-widest text-steel uppercase whitespace-nowrap">Última atualização</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-marine whitespace-nowrap">
                        {s.tracking_code}
                      </td>
                      <td className="px-4 py-3 text-ink whitespace-nowrap">
                        {s.client_name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-steel whitespace-nowrap">
                        {s.destination_city}, {s.destination_country}
                      </td>
                      <td className="px-4 py-3">
                        <ManifestRail
                          status={s.status}
                          labels={railLabels}
                          variant="condensed"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-steel whitespace-nowrap">
                        {new Date(s.updated_at).toLocaleString("pt-BR", {
                          day: "2-digit", month: "2-digit", year: "2-digit",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/shipments/${s.id}`}
                          className="text-marine text-xs hover:underline whitespace-nowrap"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
