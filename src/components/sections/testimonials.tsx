"use client";

import { Section, SectionHeader } from "@/components/layout/section";
import { motion } from "motion/react";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  dict: Dictionary;
}

const testimonials = [
  {
    name: "Maria Rossi",
    location: "Milano, IT",
    pet: "Luna (Golden Retriever)",
    text: {
      it: "Servizio impeccabile. Luna e arrivata a Berlino serena e felice. Gli aggiornamenti in tempo reale mi hanno dato una tranquillita incredibile.",
      en: "Impeccable service. Luna arrived in Berlin calm and happy. The real-time updates gave me incredible peace of mind.",
      de: "Tadelloser Service. Luna kam ruhig und glucklich in Berlin an. Die Echtzeit-Updates gaben mir unglaubliche Ruhe.",
      es: "Servicio impecable. Luna llego a Berlin tranquila y feliz. Las actualizaciones en tiempo real me dieron una tranquilidad increible.",
    },
    initials: "MR",
  },
  {
    name: "Thomas Mueller",
    location: "Monaco, DE",
    pet: "Max (Pastore Tedesco)",
    text: {
      it: "Professionalita e amore per gli animali. Max ha viaggiato da Roma in totale comfort. Lo consiglio a tutti.",
      en: "Professionalism and love for animals. Max traveled from Rome in total comfort. I recommend it to everyone.",
      de: "Professionalitat und Tierliebe. Max reiste von Rom in totalem Komfort. Ich empfehle es jedem.",
      es: "Profesionalidad y amor por los animales. Max viajo desde Roma con total comodidad. Lo recomiendo a todos.",
    },
    initials: "TM",
  },
  {
    name: "Sophie Dubois",
    location: "Lione, FR",
    pet: "Milo (Bulldog Francese)",
    text: {
      it: "Il team e stato fantastico. Ogni dettaglio curato, dal veterinario ai documenti. Milo era tranquillissimo.",
      en: "The team was fantastic. Every detail taken care of, from vet to documents. Milo was perfectly calm.",
      de: "Das Team war fantastisch. Jedes Detail wurde beachtet, vom Tierarzt bis zu den Dokumenten. Milo war vollig ruhig.",
      es: "El equipo fue fantastico. Cada detalle cuidado, del veterinario a los documentos. Milo estaba tranquilisimo.",
    },
    initials: "SD",
  },
];

export function TestimonialsSection({ dict }: Props) {
  // Detect lang from dict
  const lang = dict.nav.home === "Home" && dict.nav.howItWorks === "How It Works" ? "en"
    : dict.nav.home === "Startseite" ? "de"
    : dict.nav.home === "Inicio" ? "es"
    : "it";

  const titles: Record<string, { title: string; subtitle: string }> = {
    it: { title: "Cosa Dicono di Noi", subtitle: "Le storie di chi ha affidato il proprio pet a PetVoyage" },
    en: { title: "What They Say", subtitle: "Stories from families who trusted PetVoyage with their pets" },
    de: { title: "Was sie sagen", subtitle: "Geschichten von Familien, die PetVoyage vertraut haben" },
    es: { title: "Lo que dicen", subtitle: "Historias de familias que confiaron en PetVoyage" },
  };
  const t = titles[lang] || titles.it;

  return (
    <Section>
      <SectionHeader title={t.title} subtitle={t.subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((tm, i) => (
          <motion.div
            key={tm.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="bg-mist rounded-2xl p-8 transition-all duration-500 hover:shadow-[var(--shadow-soft)] hover:-translate-y-1"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <svg key={j} className="w-4 h-4 text-honey" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              ))}
            </div>
            <p className="text-ink/70 text-sm leading-relaxed mb-6">
              &ldquo;{tm.text[lang as keyof typeof tm.text] || tm.text.it}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pine/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-pine">{tm.initials}</span>
              </div>
              <div>
                <p className="font-medium text-ink text-sm">{tm.name}</p>
                <p className="text-xs text-ink/50">{tm.location} &middot; {tm.pet}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
