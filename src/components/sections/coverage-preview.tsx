"use client";

import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/section";
import { EuropeMap } from "@/components/europe-map";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export function CoveragePreview({ lang }: Props) {
  const labels: Record<Locale, { title: string; subtitle: string; cta: string }> = {
    it: { title: "Le Nostre Rotte", subtitle: "Copriamo le principali rotte di trasporto pet attraverso l'Europa", cta: "Scopri tutte le nostre rotte" },
    en: { title: "Our Routes", subtitle: "We cover the main pet transport routes across Europe", cta: "Discover all our routes" },
    de: { title: "Unsere Routen", subtitle: "Wir decken die wichtigsten Tiertransportrouten in Europa ab", cta: "Alle Routen entdecken" },
    es: { title: "Nuestras Rutas", subtitle: "Cubrimos las principales rutas de transporte de mascotas en Europa", cta: "Descubre todas nuestras rutas" },
  };
  const t = labels[lang];

  return (
    <Section className="bg-mist">
      <SectionHeader title={t.title} subtitle={t.subtitle} />
      <div className="max-w-4xl mx-auto">
        <EuropeMap />
        <ScrollReveal delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              href={`/${lang}/coverage`}
              className="group inline-flex items-center gap-2 text-pine font-medium hover:text-pine-deep transition-colors"
            >
              {t.cta}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
}
