"use client";

import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/section";
import { EuropeMap } from "@/components/europe-map";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function CoveragePreview() {
  return (
    <Section className="bg-mist">
      <SectionHeader
        title="Le Nostre Rotte"
        subtitle="Copriamo le principali rotte di trasporto pet attraverso l'Europa"
      />
      <div className="max-w-4xl mx-auto">
        <EuropeMap />
        <ScrollReveal delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              href="/coverage"
              className="group inline-flex items-center gap-2 text-pine font-medium hover:text-pine-deep transition-colors"
            >
              Scopri tutte le nostre rotte
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
}
