"use client";

import { Section } from "@/components/layout/section";
import { Counter } from "@/components/motion/counter";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  dict: Dictionary;
}

export function TrustBar({ dict }: Props) {
  const stats = [
    { value: 2500, suffix: "+", label: dict.trust.petsDelivered },
    { value: 100, suffix: "%", label: dict.trust.euCompliant },
    { value: 24, suffix: "/7", label: dict.trust.vetChecked },
  ];

  return (
    <div className="bg-mist border-y border-pine/5">
      <Section className="!py-10 md:!py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-pine/10">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.15}>
              <div className="text-center px-6">
                <p className="font-display text-3xl md:text-4xl font-semibold text-pine">
                  <Counter end={stat.value} suffix={stat.suffix} duration={2000} />
                </p>
                <p className="mt-1 text-sm text-ink/60">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
