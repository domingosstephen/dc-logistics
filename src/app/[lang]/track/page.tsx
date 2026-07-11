import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import { TrackingSearch } from "@/components/tracking/tracking-search";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function TrackPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            {dict.tracking.title}
          </h1>
          <p className="mt-4 text-lg text-paper/60 max-w-xl mx-auto">
            {lang === "it" ? "Inserisci il codice di tracciamento per seguire il viaggio in tempo reale" :
             lang === "de" ? "Geben Sie den Tracking-Code ein, um die Reise in Echtzeit zu verfolgen" :
             lang === "es" ? "Ingresa el codigo de rastreo para seguir el viaje en tiempo real" :
             lang === "tr" ? "Yolculuğu gerçek zamanlı takip etmek için takip kodunuzu girin" :
             "Enter your tracking code to follow the journey in real-time"}
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 -mt-8 mb-20">
        <TrackingSearch lang={lang as Locale} dict={dict} />
      </div>
    </>
  );
}
