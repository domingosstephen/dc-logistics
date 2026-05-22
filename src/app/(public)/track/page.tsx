import type { Metadata } from "next";
import { TrackingSearch } from "@/components/tracking/tracking-search";

export const metadata: Metadata = {
  title: "Traccia il Tuo Pet",
  description: "Inserisci il codice di tracciamento per seguire il viaggio del tuo pet in tempo reale.",
};

export default function TrackPage() {
  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            Traccia il Tuo Pet
          </h1>
          <p className="mt-4 text-lg text-paper/60 max-w-xl mx-auto">
            Inserisci il codice di tracciamento per seguire il viaggio in tempo reale
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 -mt-8 mb-20">
        <TrackingSearch />
      </div>
    </>
  );
}
