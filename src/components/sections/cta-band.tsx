"use client";

import Link from "next/link";
import { Section } from "@/components/layout/section";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function CtaBand() {
  return (
    <Section className="bg-pine text-paper">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-paper tracking-tight">
            Pronto per il viaggio del tuo pet?
          </h2>
          <p className="mt-4 text-lg text-paper/60">
            Richiedi un preventivo gratuito e scopri come possiamo prenderci
            cura del tuo animale.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="group inline-flex items-center justify-center rounded-full bg-honey px-8 py-3.5 text-base font-semibold text-pine-deep hover:bg-honey/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-honey/20 active:translate-y-0"
            >
              Richiedi un preventivo
              <svg
                className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  d="M3 8h10M9 4l4 4-4 4"
                />
              </svg>
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center justify-center rounded-full border-2 border-paper/30 px-8 py-3.5 text-base font-semibold text-paper hover:bg-paper/10 hover:border-paper/50 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Traccia il tuo pet
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}
