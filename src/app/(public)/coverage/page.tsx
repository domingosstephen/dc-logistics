import type { Metadata } from "next";
import { EuropeMap } from "@/components/europe-map";
import { Section, SectionHeader } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Copertura",
  description:
    "Scopri le rotte di trasporto pet di PetVoyage attraverso Italia, Germania, Francia, Spagna e tutta l'Europa.",
};

const corridors = [
  { from: "Italia", to: "Germania", cities: "Milano, Roma, Napoli → Berlino, Monaco, Amburgo" },
  { from: "Italia", to: "Francia", cities: "Milano, Torino → Lione, Parigi, Marsiglia" },
  { from: "Italia", to: "Austria", cities: "Verona, Bolzano → Vienna, Salisburgo" },
  { from: "Italia", to: "Svizzera", cities: "Milano, Como → Zurigo, Ginevra, Berna" },
  { from: "Germania", to: "Paesi Bassi", cities: "Colonia, Dusseldorf → Amsterdam, Rotterdam" },
  { from: "Germania", to: "Polonia", cities: "Berlino, Dresda → Varsavia, Cracovia" },
  { from: "Francia", to: "Spagna", cities: "Tolosa, Bordeaux → Barcellona, Madrid" },
  { from: "Francia", to: "Belgio", cities: "Lille, Parigi → Bruxelles, Anversa" },
  { from: "Italia", to: "Croazia", cities: "Trieste, Venezia → Zagabria, Spalato" },
  { from: "Italia", to: "Slovenia", cities: "Trieste, Udine → Lubiana" },
  { from: "Austria", to: "Ungheria", cities: "Vienna → Budapest" },
  { from: "Germania", to: "Regno Unito", cities: "Amburgo, Francoforte → Londra, Manchester" },
];

export default function CoveragePage() {
  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            Copertura & Rotte
          </h1>
          <p className="mt-4 text-lg text-paper/60 max-w-xl mx-auto">
            Le principali rotte di trasporto pet in Europa
          </p>
        </div>
      </section>

      <Section>
        <div className="max-w-4xl mx-auto">
          <EuropeMap />
        </div>
      </Section>

      <Section className="bg-mist">
        <SectionHeader
          title="Corridoi di Trasporto"
          subtitle="Collegamento tra le principali citta europee"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {corridors.map((c) => (
            <div
              key={`${c.from}-${c.to}`}
              className="bg-paper rounded-xl p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-pine/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-pine" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M3 10h14M13 6l4 4-4 4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-ink text-sm">
                  {c.from} → {c.to}
                </p>
                <p className="text-xs text-ink/50 mt-1">{c.cities}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
