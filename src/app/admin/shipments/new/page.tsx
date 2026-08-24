"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function NewShipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createBrowserClient();
    const form = new FormData(e.currentTarget);

    // Generate tracking code via the DB function
    const { data: codeData, error: codeError } = await supabase.rpc("next_tracking_code");
    if (codeError || !codeData) {
      setError("Erro ao gerar número de rastreio. Tente novamente.");
      setLoading(false);
      return;
    }
    const trackingCode = codeData as string;

    const { data: shipment, error: insertError } = await supabase
      .from("shipments")
      .insert({
        tracking_code: trackingCode,
        status: "registered",
        origin_city: form.get("origin_city") as string,
        origin_country: form.get("origin_country") as string,
        destination_city: form.get("destination_city") as string,
        destination_country: form.get("destination_country") as string,
        description: form.get("description") as string,
        pieces: parseInt((form.get("pieces") as string) || "1"),
        weight_kg: form.get("weight_kg") ? parseFloat(form.get("weight_kg") as string) : null,
        dimensions: (form.get("dimensions") as string) || null,
        declared_value: form.get("declared_value") ? parseFloat(form.get("declared_value") as string) : null,
        currency: (form.get("currency") as string) || "BRL",
        recipient_name: (form.get("recipient_name") as string) || null,
        recipient_phone: (form.get("recipient_phone") as string) || null,
        recipient_address: (form.get("recipient_address") as string) || null,
        client_name: (form.get("client_name") as string) || null,
        client_email: (form.get("client_email") as string) || null,
        carrier_ref: (form.get("carrier_ref") as string) || null,
      })
      .select()
      .single();

    if (insertError || !shipment) {
      setError("Erro ao registrar envio. Tente novamente.");
      setLoading(false);
      return;
    }

    // Create initial registered event
    await supabase.from("shipment_events").insert({
      shipment_id: shipment.id,
      status: "registered",
      location: `${form.get("origin_city")}, ${form.get("origin_country")}`,
      happened_at: new Date().toISOString(),
    });

    router.push(`/admin/shipments/${shipment.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-deep text-white border-b border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 py-3 flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-semibold">DC Logistics Brasil</Link>
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Admin</span>
        </div>
      </header>

      <div className="mx-auto max-w-[800px] px-5 md:px-8 py-8">
        <Link href="/admin" className="text-sm text-marine hover:underline mb-6 inline-block">
          ← Envios
        </Link>

        <h1 className="font-display text-3xl font-semibold text-deep mb-8">Novo envio</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cliente */}
          <fieldset className="bg-surface rounded-lg border border-border p-6 space-y-4">
            <legend className="font-mono text-[11px] tracking-widest text-steel uppercase px-1">Cliente</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_name" className="text-sm text-ink mb-1.5 block">Nome</Label>
                <Input id="client_name" name="client_name" className="h-10" />
              </div>
              <div>
                <Label htmlFor="client_email" className="text-sm text-ink mb-1.5 block">E-mail</Label>
                <Input id="client_email" name="client_email" type="email" className="h-10" />
              </div>
            </div>
          </fieldset>

          {/* Origem e destino */}
          <fieldset className="bg-surface rounded-lg border border-border p-6 space-y-4">
            <legend className="font-mono text-[11px] tracking-widest text-steel uppercase px-1">Origem e destino</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin_city" className="text-sm text-ink mb-1.5 block">Cidade de origem *</Label>
                <Input id="origin_city" name="origin_city" required className="h-10" />
              </div>
              <div>
                <Label htmlFor="origin_country" className="text-sm text-ink mb-1.5 block">País de origem *</Label>
                <Input id="origin_country" name="origin_country" required defaultValue="BR" className="h-10" />
              </div>
              <div>
                <Label htmlFor="destination_city" className="text-sm text-ink mb-1.5 block">Cidade de destino *</Label>
                <Input id="destination_city" name="destination_city" required className="h-10" />
              </div>
              <div>
                <Label htmlFor="destination_country" className="text-sm text-ink mb-1.5 block">País de destino *</Label>
                <Input id="destination_country" name="destination_country" required className="h-10" />
              </div>
            </div>
          </fieldset>

          {/* Destinatário */}
          <fieldset className="bg-surface rounded-lg border border-border p-6 space-y-4">
            <legend className="font-mono text-[11px] tracking-widest text-steel uppercase px-1">Destinatário</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipient_name" className="text-sm text-ink mb-1.5 block">Nome</Label>
                <Input id="recipient_name" name="recipient_name" className="h-10" />
              </div>
              <div>
                <Label htmlFor="recipient_phone" className="text-sm text-ink mb-1.5 block">Telefone</Label>
                <Input id="recipient_phone" name="recipient_phone" type="tel" className="h-10" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="recipient_address" className="text-sm text-ink mb-1.5 block">Endereço</Label>
                <Input id="recipient_address" name="recipient_address" className="h-10" />
              </div>
            </div>
          </fieldset>

          {/* Mercadoria */}
          <fieldset className="bg-surface rounded-lg border border-border p-6 space-y-4">
            <legend className="font-mono text-[11px] tracking-widest text-steel uppercase px-1">Mercadoria</legend>
            <div>
              <Label htmlFor="description" className="text-sm text-ink mb-1.5 block">Descrição *</Label>
              <Textarea id="description" name="description" required rows={2} className="resize-none" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="pieces" className="text-sm text-ink mb-1.5 block">Volumes *</Label>
                <Input id="pieces" name="pieces" type="number" min="1" defaultValue="1" required className="h-10" />
              </div>
              <div>
                <Label htmlFor="weight_kg" className="text-sm text-ink mb-1.5 block">Peso (kg)</Label>
                <Input id="weight_kg" name="weight_kg" type="number" min="0" step="0.01" className="h-10" />
              </div>
              <div>
                <Label htmlFor="dimensions" className="text-sm text-ink mb-1.5 block">Dimensões</Label>
                <Input id="dimensions" name="dimensions" placeholder="C×L×A cm" className="h-10" />
              </div>
              <div>
                <Label htmlFor="currency" className="text-sm text-ink mb-1.5 block">Moeda</Label>
                <Input id="currency" name="currency" defaultValue="BRL" className="h-10" />
              </div>
              <div>
                <Label htmlFor="declared_value" className="text-sm text-ink mb-1.5 block">Valor declarado</Label>
                <Input id="declared_value" name="declared_value" type="number" min="0" step="0.01" className="h-10" />
              </div>
              <div>
                <Label htmlFor="carrier_ref" className="text-sm text-ink mb-1.5 block">Ref. transportadora</Label>
                <Input id="carrier_ref" name="carrier_ref" className="h-10" />
              </div>
            </div>
          </fieldset>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-marine text-white hover:bg-marine/90"
          >
            {loading ? "Registrando…" : "Registrar envio"}
          </Button>
        </form>
      </div>
    </div>
  );
}
