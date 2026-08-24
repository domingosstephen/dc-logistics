"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ServiceAlert {
  id: string;
  message: string;
  severity: "info" | "critical";
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"info" | "critical">("info");
  const [expiresAt, setExpiresAt] = useState("");

  async function fetchAlerts() {
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("service_alerts")
      .select("*")
      .order("created_at", { ascending: false });
    setAlerts((data ?? []) as ServiceAlert[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!expiresAt) {
      setError("Data de expiração é obrigatória.");
      return;
    }
    setSubmitting(true);
    setError("");

    const supabase = createBrowserClient();
    const { error: insertError } = await supabase.from("service_alerts").insert({
      message,
      severity,
      is_active: true,
      expires_at: new Date(expiresAt).toISOString(),
    });

    if (insertError) {
      setError("Erro ao criar alerta.");
    } else {
      setMessage("");
      setExpiresAt("");
      setSeverity("info");
      await fetchAlerts();
    }
    setSubmitting(false);
  }

  async function toggleActive(alert: ServiceAlert) {
    const supabase = createBrowserClient();
    await supabase
      .from("service_alerts")
      .update({ is_active: !alert.is_active })
      .eq("id", alert.id);
    await fetchAlerts();
  }

  async function deleteAlert(id: string) {
    const supabase = createBrowserClient();
    await supabase.from("service_alerts").delete().eq("id", id);
    await fetchAlerts();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-deep text-white border-b border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 py-3 flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-semibold">DC Logistics Brasil</Link>
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Admin</span>
        </div>
      </header>

      <div className="mx-auto max-w-[900px] px-5 md:px-8 py-8">
        <Link href="/admin" className="text-sm text-marine hover:underline mb-6 inline-block">
          ← Painel
        </Link>

        <h1 className="font-display text-3xl font-semibold text-deep mb-8">Alertas de serviço</h1>

        {/* Create form */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-8">
          <h2 className="font-mono text-[11px] tracking-widest text-steel uppercase mb-4">Novo alerta</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="message" className="text-sm text-ink mb-1.5 block">Mensagem *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={2}
                className="resize-none"
                placeholder="Ex.: Possível atraso nos envios para a Europa devido a condições climáticas."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="severity" className="text-sm text-ink mb-1.5 block">Severidade</Label>
                <select
                  id="severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as "info" | "critical")}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="info">Informativo</option>
                  <option value="critical">Crítico</option>
                </select>
              </div>
              <div>
                <Label htmlFor="expires_at" className="text-sm text-ink mb-1.5 block">Expira em *</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              disabled={submitting}
              className="bg-marine text-white hover:bg-marine/90 h-9 px-4 text-sm"
            >
              {submitting ? "Criando…" : "Criar alerta"}
            </Button>
          </form>
        </div>

        {/* Alerts list */}
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-steel text-sm">Carregando…</div>
          ) : alerts.length === 0 ? (
            <div className="p-12 text-center text-steel text-sm">Nenhum alerta cadastrado.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-b-deep text-left">
                  <th className="px-4 py-3 font-mono text-[11px] tracking-widest text-steel uppercase">Mensagem</th>
                  <th className="px-4 py-3 font-mono text-[11px] tracking-widest text-steel uppercase whitespace-nowrap">Tipo</th>
                  <th className="px-4 py-3 font-mono text-[11px] tracking-widest text-steel uppercase whitespace-nowrap">Expira</th>
                  <th className="px-4 py-3 font-mono text-[11px] tracking-widest text-steel uppercase whitespace-nowrap">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {alerts.map((alert) => {
                  const expired = new Date(alert.expires_at) < new Date();
                  return (
                    <tr key={alert.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-ink max-w-xs">{alert.message}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`font-mono text-[11px] tracking-widest uppercase px-2 py-0.5 rounded ${
                          alert.severity === "critical"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-50 text-blue-700"
                        }`}>
                          {alert.severity === "critical" ? "Crítico" : "Info"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-steel whitespace-nowrap">
                        {new Date(alert.expires_at).toLocaleString("pt-BR", {
                          day: "2-digit", month: "2-digit", year: "2-digit",
                          hour: "2-digit", minute: "2-digit",
                        })}
                        {expired && <span className="ml-1 text-destructive">(expirado)</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(alert)}
                          className={`font-mono text-[11px] tracking-widest uppercase px-2 py-0.5 rounded border transition-colors ${
                            alert.is_active && !expired
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-muted text-steel border-border"
                          }`}
                        >
                          {alert.is_active && !expired ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
