"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Shipment, ShipmentStatus } from "@/types/database";

const statusFilters: (ShipmentStatus | "all")[] = [
  "all",
  "registered",
  "documentation",
  "awaiting_departure",
  "in_transit",
  "border_crossing",
  "arrival_hub",
  "out_for_delivery",
  "delivered",
  "on_hold",
  "delayed",
];

export default function AdminDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("shipments")
      .select("*")
      .order("updated_at", { ascending: false });
    setShipments(data || []);
    setLoading(false);
  };

  const filtered = shipments.filter((s) => {
    const matchesSearch =
      !search ||
      s.tracking_code.toLowerCase().includes(search.toLowerCase()) ||
      s.pet_name.toLowerCase().includes(search.toLowerCase()) ||
      (s.customer_name && s.customer_name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLogout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-mist">
      {/* Admin header */}
      <header className="bg-pine-deep text-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display text-xl font-semibold">InfoAnimaleCarico</span>
            <span className="text-xs bg-honey/20 text-honey px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-paper/60 hover:text-paper transition-colors">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-paper/60 hover:text-paper transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink">Shipments</h1>
          <Link href="/admin/shipments/new">
            <Button className="bg-pine text-paper hover:bg-pine-deep rounded-xl">
              + New Shipment
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-paper rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by code, pet or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border-pine/20 bg-mist max-w-xs"
          />
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  statusFilter === s
                    ? "bg-pine text-paper border-pine"
                    : "border-pine/20 text-ink/60 hover:border-pine/40"
                }`}
              >
                {s === "all" ? "All" : s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-paper rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-ink/40">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-ink/40">No shipments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-pine/5 text-left">
                    <th className="px-4 py-3 font-medium text-ink/50">Code</th>
                    <th className="px-4 py-3 font-medium text-ink/50">Pet</th>
                    <th className="px-4 py-3 font-medium text-ink/50">Route</th>
                    <th className="px-4 py-3 font-medium text-ink/50">Status</th>
                    <th className="px-4 py-3 font-medium text-ink/50">Customer</th>
                    <th className="px-4 py-3 font-medium text-ink/50">ETA</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-pine/5 last:border-0 hover:bg-mist/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-pine font-medium">
                        {s.tracking_code}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{s.pet_name}</p>
                        <p className="text-xs text-ink/40">{s.pet_breed || s.pet_species}</p>
                      </td>
                      <td className="px-4 py-3 text-ink/60">
                        {s.origin_city} → {s.destination_city}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-4 py-3 text-ink/60">
                        {s.customer_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-ink/60 text-xs">
                        {s.estimated_delivery
                          ? new Date(s.estimated_delivery).toLocaleDateString("en-GB")
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/shipments/${s.id}`}
                          className="text-pine text-xs font-medium hover:text-pine-deep"
                        >
                          Details →
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
