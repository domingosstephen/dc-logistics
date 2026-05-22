import type { Metadata } from "next";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { CareSection } from "@/components/sections/care";
import { CtaBand } from "@/components/sections/cta-band";
import { Section, SectionHeader } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Come Funziona",
  description:
    "Scopri come funziona il trasporto pet con PetVoyage: dalla prenotazione alla riunione con la famiglia.",
};

const details = [
  {
    step: "01",
    title: "Prenotazione & Preventivo",
    items: [
      "Compila il modulo con i dettagli del tuo pet e del viaggio",
      "Ricevi un preventivo personalizzato entro 24 ore",
      "Conferma la prenotazione e scegli la data di partenza",
    ],
  },
  {
    step: "02",
    title: "Preparazione Documentale",
    items: [
      "Verifica e aggiornamento del microchip",
      "Controllo vaccinazioni (inclusa antirabbica)",
      "Rilascio del certificato sanitario veterinario",
      "Preparazione del passaporto EU per animali",
    ],
  },
  {
    step: "03",
    title: "Il Viaggio",
    items: [
      "Trasportino confortevole e ventilato",
      "Soste di riposo ogni 4 ore per acqua, cibo e esercizio",
      "Temperatura controllata durante tutto il tragitto",
      "Accompagnamento dedicato da un operatore esperto",
      "Aggiornamenti in tempo reale via tracking",
    ],
  },
  {
    step: "04",
    title: "Arrivo & Riunione",
    items: [
      "Arrivo all'hub di destinazione e periodo di riposo",
      "Consegna finale al domicilio o punto di ritiro",
      "Documentazione completa consegnata alla famiglia",
      "Il momento magico della riunione",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            Come Funziona
          </h1>
          <p className="mt-4 text-lg text-paper/60 max-w-xl mx-auto">
            Ogni dettaglio curato per un viaggio sereno e sicuro per il tuo pet.
          </p>
        </div>
      </section>

      <HowItWorksSection />

      {/* Detailed steps */}
      <Section className="bg-mist">
        <SectionHeader
          title="Ogni Passo nel Dettaglio"
          subtitle="Trasparenza totale su come ci prendiamo cura del tuo animale"
        />
        <div className="max-w-3xl mx-auto space-y-12">
          {details.map((d) => (
            <div key={d.step} className="bg-paper rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-5">
                <span className="w-10 h-10 rounded-full bg-pine flex items-center justify-center text-paper font-display text-sm font-semibold">
                  {d.step}
                </span>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {d.title}
                </h3>
              </div>
              <ul className="space-y-3 ml-14">
                {d.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-ink/70"
                  >
                    <svg
                      className="w-4 h-4 text-pine mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 16 16"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        d="M3 8.5l3 3 7-7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <CareSection />
      <CtaBand />
    </>
  );
}
