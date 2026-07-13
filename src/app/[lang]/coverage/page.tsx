import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import { EuropeMap } from "@/components/europe-map";
import { Section, SectionHeader } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";

interface Props {
  params: Promise<{ lang: string }>;
}

const corridors = [
  // Europe
  { from: "Italy", to: "Germany", cities: "Milan, Rome, Naples -> Berlin, Munich, Hamburg" },
  { from: "Italy", to: "France", cities: "Milan, Turin -> Lyon, Paris, Marseille" },
  { from: "Italy", to: "Austria", cities: "Verona, Bolzano -> Vienna, Salzburg" },
  { from: "Italy", to: "Switzerland", cities: "Milan, Como -> Zurich, Geneva, Bern" },
  { from: "Germany", to: "Netherlands", cities: "Cologne, Dusseldorf -> Amsterdam, Rotterdam" },
  { from: "Germany", to: "Poland", cities: "Berlin, Dresden -> Warsaw, Krakow" },
  { from: "France", to: "Spain", cities: "Toulouse, Bordeaux -> Barcelona, Madrid" },
  { from: "Germany", to: "UK", cities: "Hamburg, Frankfurt -> London, Manchester" },
  { from: "Italy", to: "Turkey", cities: "Rome, Milan -> Istanbul, Ankara, Izmir" },
  { from: "Germany", to: "Turkey", cities: "Berlin, Frankfurt -> Istanbul, Ankara" },
  { from: "Italy", to: "Cyprus", cities: "Rome, Milan -> Nicosia, Limassol, Larnaca" },
  { from: "Greece", to: "Cyprus", cities: "Athens, Thessaloniki -> Nicosia, Limassol" },
  { from: "UK", to: "Cyprus", cities: "London -> Nicosia, Limassol, Paphos" },
  // Transatlantic
  { from: "Italy", to: "USA", cities: "Rome, Milan -> New York, Miami, Los Angeles" },
  { from: "Italy", to: "Brazil", cities: "Rome, Milan -> Sao Paulo, Rio de Janeiro" },
  { from: "Germany", to: "USA", cities: "Frankfurt, Munich -> New York, Chicago" },
  { from: "Spain", to: "Mexico", cities: "Madrid, Barcelona -> Mexico City, Cancun" },
  { from: "Spain", to: "Argentina", cities: "Madrid -> Buenos Aires" },
  { from: "France", to: "Canada", cities: "Paris -> Montreal, Toronto" },
  { from: "UK", to: "USA", cities: "London -> New York, Miami" },
  // Americas
  { from: "USA", to: "Canada", cities: "New York, Miami -> Toronto, Montreal, Vancouver" },
  { from: "USA", to: "Mexico", cities: "Los Angeles, Houston -> Mexico City, Guadalajara" },
  { from: "USA", to: "Brazil", cities: "Miami, New York -> Sao Paulo, Rio de Janeiro" },
  { from: "USA", to: "Colombia", cities: "Miami -> Bogota, Medellin" },
  { from: "Brazil", to: "Argentina", cities: "Sao Paulo -> Buenos Aires" },
  { from: "Colombia", to: "Ecuador", cities: "Bogota -> Quito, Guayaquil" },
  { from: "Peru", to: "Chile", cities: "Lima -> Santiago" },
];

export default async function CoveragePage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const pageTitle = lang === "it" ? "Copertura & Rotte" : lang === "de" ? "Abdeckung & Routen" : lang === "es" ? "Cobertura & Rutas" : lang === "tr" ? "Kapsama Alanı & Güzergahlar" : "Coverage & Routes";
  const corridorsTitle = lang === "it" ? "Corridoi di Trasporto" : lang === "de" ? "Transportkorridore" : lang === "es" ? "Corredores de Transporte" : lang === "tr" ? "Taşımacılık Güzergahları" : "Transport Corridors";

  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">{pageTitle}</h1>
        </div>
      </section>
      <Section>
        <div className="max-w-4xl mx-auto"><EuropeMap /></div>
      </Section>
      <Section className="bg-mist">
        <SectionHeader title={corridorsTitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {corridors.map((c) => (
            <div key={`${c.from}-${c.to}`} className="bg-paper rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-pine/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-pine" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M3 10h14M13 6l4 4-4 4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-ink text-sm">{c.from} &rarr; {c.to}</p>
                <p className="text-xs text-ink/50 mt-1">{c.cities}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand lang={lang as Locale} dict={dict} />
    </>
  );
}
