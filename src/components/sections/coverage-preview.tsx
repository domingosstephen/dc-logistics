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
    tr: { title: "Güzergahlarımız", subtitle: "Avrupa genelinde başlıca evcil hayvan taşımacılığı güzergahlarını kapsıyoruz", cta: "Tüm güzergahları keşfedin" },
  };
  const t = labels[lang];

  return (
    <Section className="bg-mist relative overflow-hidden">
      {/* Background map silhouette */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <EuropeOutline className="w-[900px] h-[900px] text-pine/[0.03]" />
      </div>

      <div className="relative z-10">
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
      </div>
    </Section>
  );
}

function EuropeOutline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 700" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Simplified Europe continent outlines */}
      {/* Iberian Peninsula (Spain/Portugal) */}
      <path d="M120,380 L100,360 L80,370 L60,400 L55,440 L70,480 L90,500 L120,510 L160,500 L200,480 L220,450 L230,420 L220,390 L200,370 L170,360 Z" />
      {/* France */}
      <path d="M220,390 L230,350 L250,320 L270,300 L300,290 L320,300 L330,330 L320,360 L300,380 L270,400 L240,410 L220,410 Z" />
      {/* UK */}
      <path d="M200,220 L190,240 L180,270 L190,290 L210,300 L230,290 L240,270 L235,250 L225,230 L210,220 Z" />
      <path d="M170,250 L160,270 L170,290 L185,280 L180,260 Z" />
      {/* Italy */}
      <path d="M340,340 L350,360 L360,390 L355,420 L345,450 L330,470 L340,490 L360,500 L370,480 L375,450 L380,420 L385,400 L380,380 L370,360 L360,340 Z" />
      {/* Sicily */}
      <path d="M340,500 L350,510 L370,510 L375,500 L360,495 Z" />
      {/* Sardinia */}
      <path d="M310,440 L305,460 L310,475 L320,470 L318,450 Z" />
      {/* Germany/Central Europe */}
      <path d="M300,290 L310,270 L330,250 L360,240 L390,250 L400,270 L395,300 L380,320 L360,340 L340,340 L320,320 L300,300 Z" />
      {/* Scandinavia (Norway/Sweden) */}
      <path d="M320,80 L310,100 L300,130 L305,170 L320,200 L340,220 L360,230 L370,210 L365,180 L355,150 L345,120 L335,95 Z" />
      {/* Finland */}
      <path d="M400,80 L390,110 L395,150 L410,180 L430,190 L440,170 L435,130 L420,100 Z" />
      {/* Poland/Eastern Europe */}
      <path d="M390,250 L410,240 L440,245 L470,260 L480,290 L470,320 L450,330 L420,320 L400,300 L395,270 Z" />
      {/* Balkans */}
      <path d="M400,340 L420,330 L450,340 L470,360 L475,390 L460,420 L440,440 L420,430 L400,410 L390,380 L395,360 Z" />
      {/* Greece */}
      <path d="M440,440 L450,460 L445,490 L430,510 L415,500 L420,470 L430,450 Z" />
      {/* Baltic states */}
      <path d="M420,200 L440,195 L460,210 L455,235 L440,240 L420,230 Z" />
    </svg>
  );
}
