"use client";

import Link from "next/link";
import { Section } from "@/components/layout/section";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  lang: Locale;
  dict: Dictionary;
}

const content: Record<Locale, { title: string; subtitle: string }> = {
  it: { title: "Pronto per il viaggio del tuo pet?", subtitle: "Richiedi un preventivo gratuito e scopri come possiamo prenderci cura del tuo animale." },
  en: { title: "Ready for your pet's journey?", subtitle: "Request a free quote and discover how we can take care of your pet." },
  de: { title: "Bereit fur die Reise Ihres Tieres?", subtitle: "Fordern Sie ein kostenloses Angebot an und entdecken Sie, wie wir Ihr Tier betreuen." },
  es: { title: "Listo para el viaje de tu mascota?", subtitle: "Solicita un presupuesto gratuito y descubre como podemos cuidar de tu mascota." },
};

export function CtaBand({ lang, dict }: Props) {
  const t = content[lang];

  return (
    <Section className="bg-pine text-paper">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-paper tracking-tight">
            {t.title}
          </h2>
          <p className="mt-4 text-lg text-paper/60">{t.subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${lang}/quote`}
              className="group inline-flex items-center justify-center rounded-full bg-honey px-8 py-3.5 text-base font-semibold text-pine-deep hover:bg-honey/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-honey/20 active:translate-y-0"
            >
              {dict.hero.quoteCta}
              <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link
              href={`/${lang}/track`}
              className="inline-flex items-center justify-center rounded-full border-2 border-paper/30 px-8 py-3.5 text-base font-semibold text-paper hover:bg-paper/10 hover:border-paper/50 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {dict.hero.trackCta}
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}
