"use client";

import { Section, SectionHeader } from "@/components/layout/section";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Maria Rossi",
    location: "Milano, IT",
    pet: "Luna (Golden Retriever)",
    text: "Servizio impeccabile. Luna e arrivata a Berlino serena e felice. Gli aggiornamenti in tempo reale mi hanno dato una tranquillita incredibile.",
  },
  {
    name: "Thomas Mueller",
    location: "Monaco, DE",
    pet: "Max (Pastore Tedesco)",
    text: "Professionalita e amore per gli animali. Max ha viaggiato da Roma in totale comfort. Lo consiglio a tutti.",
  },
  {
    name: "Sophie Dubois",
    location: "Lione, FR",
    pet: "Milo (Bulldog Francese)",
    text: "Il team e stato fantastico. Ogni dettaglio curato, dal veterinario ai documenti. Milo era tranquillissimo.",
  },
];

export function TestimonialsSection() {
  return (
    <Section>
      <SectionHeader
        title="Cosa Dicono di Noi"
        subtitle="Le storie di chi ha affidato il proprio pet a PetVoyage"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-mist rounded-2xl p-8"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <svg
                  key={j}
                  className="w-4 h-4 text-honey"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              ))}
            </div>

            <p className="text-ink/70 text-sm leading-relaxed mb-6">
              &ldquo;{t.text}&rdquo;
            </p>

            <div>
              <p className="font-medium text-ink text-sm">{t.name}</p>
              <p className="text-xs text-ink/50">
                {t.location} &middot; {t.pet}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
