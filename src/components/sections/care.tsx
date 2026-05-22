"use client";

import { Section, SectionHeader } from "@/components/layout/section";
import { motion } from "motion/react";

const carePoints = [
  {
    title: "Trasportini Confortevoli",
    description:
      "Trasportini spaziosi e ventilati, con coperte morbide e familiarita per ridurre lo stress.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 28 28" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="8" width="22" height="14" rx="3" />
        <path d="M7 8V6a2 2 0 012-2h10a2 2 0 012 2v2" />
        <circle cx="14" cy="15" r="3" />
      </svg>
    ),
  },
  {
    title: "Soste di Riposo",
    description:
      "Soste programmate ogni 4 ore per acqua, cibo, esercizio e tanto amore.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 28 28" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="14" cy="14" r="10" />
        <path d="M14 8v6l4 3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Clima Controllato",
    description:
      "Temperatura ottimale durante tutto il viaggio, estate e inverno. Il comfort viene prima.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 28 28" stroke="currentColor" strokeWidth={1.5}>
        <path d="M14 4v20M14 4l-4 4M14 4l4 4M14 24l-4-4M14 24l4-4M4 14h20M4 14l4-4M4 14l4 4M24 14l-4-4M24 14l-4 4" />
      </svg>
    ),
  },
  {
    title: "Accompagnamento Dedicato",
    description:
      "Un operatore esperto accompagna il tuo pet per tutto il viaggio, garantendo serenita.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 28 28" stroke="currentColor" strokeWidth={1.5}>
        <path d="M14 24s-8-4.5-8-11a8 8 0 0116 0c0 6.5-8 11-8 11z" />
        <circle cx="14" cy="13" r="2.5" />
      </svg>
    ),
  },
];

export function CareSection() {
  return (
    <Section className="bg-pine-deep text-paper">
      <SectionHeader
        title="La Nostra Cura"
        subtitle="Il benessere del tuo animale viene prima di tutto"
        className="[&_h2]:text-paper [&_p]:text-paper/60"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {carePoints.map((point, i) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex gap-5 p-6 rounded-2xl bg-paper/5 hover:bg-paper/10 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-honey/20 flex items-center justify-center text-honey shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]">
              {point.icon}
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-paper mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-paper/60 leading-relaxed">
                {point.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
