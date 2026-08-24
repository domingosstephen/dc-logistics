import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import type { Locale } from "./dictionaries";
import { HeroSection } from "@/components/sections/hero";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqPreview } from "@/components/sections/faq-preview";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <HeroSection lang={lang as Locale} dict={dict} />
      <WhatWeDoSection dict={dict} lang={lang as Locale} />
      <HowItWorksSection dict={dict} lang={lang as Locale} />
      <WhyUsSection dict={dict} />
      <CtaBand lang={lang as Locale} dict={dict} />
      <FaqPreview lang={lang as Locale} dict={dict} />
    </>
  );
}

const HOME_SERVICES_PT = [
  { title: "Carga Aérea", body: "Exportação e importação com transit time de 3 a 10 dias úteis. Cargas consolidadas ou exclusivas." },
  { title: "Carga Marítima", body: "FCL e LCL para os principais portos da Europa, Ásia e Américas. Melhor custo-benefício para grandes volumes." },
  { title: "Desembaraço Aduaneiro", body: "Assessoria completa em importação e exportação: classificação fiscal, licenciamento e liberação alfandegária." },
  { title: "Door-to-Door", body: "Coleta, transporte internacional e entrega no endereço final — com rastreamento em cada etapa." },
];
const HOME_SERVICES_EN = [
  { title: "Air Freight", body: "Import and export with 3–10 business day transit times. Consolidated or exclusive loads." },
  { title: "Sea Freight", body: "FCL and LCL to major ports in Europe, Asia, and the Americas. Best value for large volumes." },
  { title: "Customs Clearance", body: "Full advisory for import and export: tariff classification, licensing, and customs release." },
  { title: "Door-to-Door", body: "Collection, international transport, and delivery to the final address — tracked at every stage." },
];

function WhatWeDoSection({ dict, lang }: { dict: Awaited<ReturnType<typeof getDictionary>>; lang: Locale }) {
  const services = lang === "pt" ? HOME_SERVICES_PT : HOME_SERVICES_EN;
  return (
    <section className="mx-auto max-w-[1200px] px-5 md:px-8 py-24 md:py-32">
      <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-4">
        {dict.services.eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold text-deep mb-10">
        {dict.services.heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.title} className="bg-surface rounded-lg border border-border p-6">
            <h3 className="font-display text-lg font-semibold text-deep mb-2">{s.title}</h3>
            <p className="text-sm text-steel leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <a href={`/${lang}/services`} className="text-sm text-marine hover:underline">
          {dict.services.seeAll} →
        </a>
      </div>
    </section>
  );
}

function WhyUsSection({ dict }: { dict: Awaited<ReturnType<typeof getDictionary>> }) {
  return (
    <section className="mx-auto max-w-[1200px] px-5 md:px-8 py-24 md:py-32">
      <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-4">
        {dict.whyUs.eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold text-deep mb-10">
        {dict.whyUs.heading}
      </h2>
      <div className="border-t-2 border-t-deep">
        {[dict.whyUs.item1, dict.whyUs.item2, dict.whyUs.item3].map((item, i) => (
          <div key={i} className="py-5 border-b border-border flex gap-8">
            <span className="font-mono text-[11px] text-steel shrink-0 pt-0.5">0{i + 1}</span>
            <p className="text-ink">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
