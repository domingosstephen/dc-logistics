"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitQuote } from "@/app/actions/quote";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface QuoteFormProps {
  dict: Dictionary;
}

const countries = [
  "Italia", "Germania", "Francia", "Spagna", "Austria", "Svizzera",
  "Paesi Bassi", "Belgio", "Polonia", "Rep. Ceca", "Croazia",
  "Slovenia", "Ungheria", "Regno Unito", "Portogallo", "Romania",
  "Grecia", "Bulgaria",
];

export function QuoteForm({ dict }: QuoteFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      pet_species: form.get("pet_species") as string,
      pet_breed: form.get("pet_breed") as string,
      origin_city: form.get("origin_city") as string,
      origin_country: form.get("origin_country") as string,
      destination_city: form.get("destination_city") as string,
      destination_country: form.get("destination_country") as string,
      preferred_date: form.get("preferred_date") as string,
      customer_name: form.get("customer_name") as string,
      customer_email: form.get("customer_email") as string,
      message: form.get("message") as string,
    };

    const result = await submitQuote(data);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Errore sconosciuto");
    }
  };

  if (success) {
    return (
      <div className="bg-paper rounded-2xl shadow-[var(--shadow-soft)] p-8 md:p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-pine/10 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">
          {dict.quote.success.split("!")[0]}!
        </h2>
        <p className="text-ink/60 text-sm">
          {dict.quote.success}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-paper rounded-2xl shadow-[var(--shadow-soft)] p-8 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pet info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pet_species">{dict.quote.petSpecies} *</Label>
            <select
              id="pet_species"
              name="pet_species"
              required
              className="mt-1.5 h-10 w-full rounded-xl border border-pine/20 bg-mist px-3 text-sm text-ink focus:border-pine focus:ring-pine"
            >
              <option value="dog">{dict.quote.dog}</option>
              <option value="cat">{dict.quote.cat}</option>
              <option value="other">{dict.quote.other}</option>
            </select>
          </div>
          <div>
            <Label htmlFor="pet_breed">{dict.quote.petBreed}</Label>
            <Input
              id="pet_breed"
              name="pet_breed"
              placeholder="Es. Golden Retriever"
              className="mt-1.5 rounded-xl border-pine/20 bg-mist"
            />
          </div>
        </div>

        {/* Origin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="origin_city">{dict.quote.originCity} *</Label>
            <Input
              id="origin_city"
              name="origin_city"
              required
              placeholder="Es. Milano"
              className="mt-1.5 rounded-xl border-pine/20 bg-mist"
            />
          </div>
          <div>
            <Label htmlFor="origin_country">{dict.quote.originCountry} *</Label>
            <select
              id="origin_country"
              name="origin_country"
              required
              className="mt-1.5 h-10 w-full rounded-xl border border-pine/20 bg-mist px-3 text-sm text-ink focus:border-pine focus:ring-pine"
            >
              <option value="">Seleziona...</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="destination_city">{dict.quote.destinationCity} *</Label>
            <Input
              id="destination_city"
              name="destination_city"
              required
              placeholder="Es. Berlino"
              className="mt-1.5 rounded-xl border-pine/20 bg-mist"
            />
          </div>
          <div>
            <Label htmlFor="destination_country">{dict.quote.destinationCountry} *</Label>
            <select
              id="destination_country"
              name="destination_country"
              required
              className="mt-1.5 h-10 w-full rounded-xl border border-pine/20 bg-mist px-3 text-sm text-ink focus:border-pine focus:ring-pine"
            >
              <option value="">Seleziona...</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <Label htmlFor="preferred_date">{dict.quote.preferredDate}</Label>
          <Input
            id="preferred_date"
            name="preferred_date"
            type="date"
            className="mt-1.5 rounded-xl border-pine/20 bg-mist"
          />
        </div>

        {/* Customer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer_name">{dict.quote.customerName} *</Label>
            <Input
              id="customer_name"
              name="customer_name"
              required
              placeholder="Nome e cognome"
              className="mt-1.5 rounded-xl border-pine/20 bg-mist"
            />
          </div>
          <div>
            <Label htmlFor="customer_email">{dict.quote.customerEmail} *</Label>
            <Input
              id="customer_email"
              name="customer_email"
              type="email"
              required
              placeholder="email@esempio.it"
              className="mt-1.5 rounded-xl border-pine/20 bg-mist"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">{dict.quote.message}</Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Raccontaci di piu sul tuo pet e sul viaggio..."
            className="mt-1.5 rounded-xl border-pine/20 bg-mist resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-[#C0563E]">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-pine text-paper hover:bg-pine-deep font-medium text-base"
        >
          {loading ? "..." : dict.quote.submit}
        </Button>
      </form>
    </div>
  );
}
