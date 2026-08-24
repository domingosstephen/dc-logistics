"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export function QuoteForm({ lang: _lang, dict }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/quote", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(fd)),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <p className="text-ink">{dict.quote.success.replace("{email}", email)}</p>
      </div>
    );
  }

  const q = dict.quote;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Label htmlFor="company" className="text-sm text-ink mb-1.5 block">{q.company}</Label>
          <Input id="company" name="company" className="h-10" />
        </div>
        <div>
          <Label htmlFor="contact_name" className="text-sm text-ink mb-1.5 block">{q.contactName} *</Label>
          <Input id="contact_name" name="contact_name" required className="h-10" />
        </div>
        <div>
          <Label htmlFor="contact_email" className="text-sm text-ink mb-1.5 block">{q.email} *</Label>
          <Input id="contact_email" name="contact_email" type="email" required className="h-10"
            onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="contact_phone" className="text-sm text-ink mb-1.5 block">{q.phone}</Label>
          <Input id="contact_phone" name="contact_phone" type="tel" className="h-10" />
        </div>
        <div>
          <Label htmlFor="origin_city" className="text-sm text-ink mb-1.5 block">{q.originCity} *</Label>
          <Input id="origin_city" name="origin_city" required className="h-10" />
        </div>
        <div>
          <Label htmlFor="dest_country" className="text-sm text-ink mb-1.5 block">{q.destCountry} *</Label>
          <Input id="dest_country" name="dest_country" required className="h-10" />
        </div>
        <div>
          <Label htmlFor="dest_city" className="text-sm text-ink mb-1.5 block">{q.destCity} *</Label>
          <Input id="dest_city" name="dest_city" required className="h-10" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description" className="text-sm text-ink mb-1.5 block">{q.description} *</Label>
          <Input id="description" name="description" required className="h-10" />
        </div>
        <div>
          <Label htmlFor="pieces" className="text-sm text-ink mb-1.5 block">{q.pieces}</Label>
          <Input id="pieces" name="pieces" type="number" min="1" className="h-10" />
        </div>
        <div>
          <Label htmlFor="weight_kg" className="text-sm text-ink mb-1.5 block">{q.weight}</Label>
          <Input id="weight_kg" name="weight_kg" type="number" min="0" step="0.01" className="h-10" />
        </div>
        <div>
          <Label htmlFor="dimensions" className="text-sm text-ink mb-1.5 block">{q.dimensions}</Label>
          <Input id="dimensions" name="dimensions" className="h-10" />
        </div>
        <div>
          <Label htmlFor="declared_value" className="text-sm text-ink mb-1.5 block">{q.declaredValue}</Label>
          <Input id="declared_value" name="declared_value" type="number" min="0" step="0.01" className="h-10" />
        </div>
        <div>
          <Label htmlFor="currency" className="text-sm text-ink mb-1.5 block">{q.currency}</Label>
          <Input id="currency" name="currency" defaultValue="BRL" className="h-10" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes" className="text-sm text-ink mb-1.5 block">{q.notes}</Label>
          <Textarea id="notes" name="notes" rows={4} className="resize-none" />
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{q.error}</p>
      )}

      <Button type="submit" disabled={status === "sending"}
        className="bg-marine text-white hover:bg-marine/90 h-10 px-6">
        {status === "sending" ? dict.micro.saving : q.submit}
      </Button>
    </form>
  );
}
