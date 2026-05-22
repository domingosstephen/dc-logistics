import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = {
  title: "Richiedi Preventivo",
  description: "Richiedi un preventivo gratuito per il trasporto del tuo pet attraverso l'Europa.",
};

export default function QuotePage() {
  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            Richiedi un Preventivo
          </h1>
          <p className="mt-4 text-lg text-paper/60 max-w-xl mx-auto">
            Raccontaci del viaggio del tuo pet e ti ricontatteremo entro 24 ore
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 -mt-8 mb-20">
        <QuoteForm />
      </div>
    </>
  );
}
