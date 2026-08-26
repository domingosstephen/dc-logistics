import { notFound } from "next/navigation";
import Image from "next/image";
import { getDictionary, hasLocale } from "./dictionaries";
import type { Locale } from "./dictionaries";
import { HeroSection } from "@/components/sections/hero";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqPreview } from "@/components/sections/faq-preview";
import { StatsStrip } from "@/components/sections/stats-strip";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/motion/animate-in";

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
      <StatsStrip lang={lang as Locale} />
      <WhatWeDoSection dict={dict} lang={lang as Locale} />
      <HowItWorksSection dict={dict} lang={lang as Locale} />
      <WhyUsSection dict={dict} lang={lang as Locale} />
      <CtaBand lang={lang as Locale} dict={dict} />
      <FaqPreview lang={lang as Locale} dict={dict} />
    </>
  );
}

const HOME_SERVICES_PT = [
  {
    title: "Carga Aérea",
    body: "Exportação e importação com transit time de 3 a 10 dias úteis. Cargas consolidadas ou exclusivas.",
    image: "/service-air.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
  {
    title: "Carga Marítima",
    body: "FCL e LCL para os principais portos da Europa, Ásia e Américas. Melhor custo-benefício para grandes volumes.",
    image: "/service-sea.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M6.75 7.5h10.5M5.25 9l1.5 7.5h10.5L18.75 9M3 19.5h18M6 17.25a6 6 0 0012 0" />
      </svg>
    ),
  },
  {
    title: "Desembaraço Aduaneiro",
    body: "Assessoria completa em importação e exportação: classificação fiscal, licenciamento e liberação alfandegária.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Door-to-Door",
    body: "Coleta, transporte internacional e entrega no endereço final — com rastreamento em cada etapa.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

const HOME_SERVICES_EN = [
  {
    title: "Air Freight",
    body: "Import and export with 3–10 business day transit times. Consolidated or exclusive loads.",
    image: "/service-air.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
  {
    title: "Sea Freight",
    body: "FCL and LCL to major ports in Europe, Asia, and the Americas. Best value for large volumes.",
    image: "/service-sea.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M6.75 7.5h10.5M5.25 9l1.5 7.5h10.5L18.75 9M3 19.5h18M6 17.25a6 6 0 0012 0" />
      </svg>
    ),
  },
  {
    title: "Customs Clearance",
    body: "Full advisory for import and export: tariff classification, licensing, and customs release.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Door-to-Door",
    body: "Collection, international transport, and delivery to the final address — tracked at every stage.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

function WhatWeDoSection({ dict, lang }: { dict: Awaited<ReturnType<typeof getDictionary>>; lang: Locale }) {
  const services = lang === "pt" ? HOME_SERVICES_PT : HOME_SERVICES_EN;
  return (
    <section className="mx-auto max-w-[1200px] px-5 md:px-8 py-24 md:py-32">
      <AnimateIn>
        <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-4">
          {dict.services.eyebrow}
        </p>
        <h2 className="font-display text-3xl font-semibold text-deep mb-10">
          {dict.services.heading}
        </h2>
      </AnimateIn>
      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((s) => (
          <StaggerItem key={s.title}>
            <div className="group bg-surface rounded-xl border border-border overflow-hidden hover:border-marine/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              {"image" in s && s.image && (
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={s.image as string}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="text-marine mb-4">{s.icon}</div>
                <h3 className="font-display text-lg font-semibold text-deep mb-2">{s.title}</h3>
                <p className="text-sm text-steel leading-relaxed">{s.body}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
      <AnimateIn delay={0.4} className="mt-8">
        <a href={`/${lang}/services`} className="inline-flex items-center gap-1 text-sm text-marine hover:text-marine/80 hover:gap-2 transition-all duration-200">
          {dict.services.seeAll}
          <span aria-hidden="true">→</span>
        </a>
      </AnimateIn>
    </section>
  );
}

const WHY_US_ICONS = [
  // Person with pen — human updates
  <svg key="icon1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 shrink-0 text-marine mt-0.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>,
  // List / history
  <svg key="icon2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 shrink-0 text-marine mt-0.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h4.5M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>,
  // Key / own access
  <svg key="icon3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 shrink-0 text-marine mt-0.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>,
];

function WhyUsSection({ dict, lang }: { dict: Awaited<ReturnType<typeof getDictionary>>; lang: Locale }) {
  const items = [dict.whyUs.item1, dict.whyUs.item2, dict.whyUs.item3];
  return (
    <section className="bg-mist border-y border-border">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <AnimateIn>
              <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-4">
                {dict.whyUs.eyebrow}
              </p>
              <h2 className="font-display text-3xl font-semibold text-deep mb-10">
                {dict.whyUs.heading}
              </h2>
            </AnimateIn>
            <div className="border-t-2 border-t-deep">
              {items.map((item, i) => (
                <AnimateIn key={i} delay={i * 0.12}>
                  <div className="py-6 border-b border-border flex gap-6 items-start group hover:bg-white/60 hover:px-4 hover:rounded-lg transition-all duration-300 -mx-0 hover:-mx-4">
                    <span className="font-mono text-[11px] text-steel/60 shrink-0 pt-1">0{i + 1}</span>
                    <div className="flex gap-4 items-start">
                      {WHY_US_ICONS[i]}
                      <p className="text-ink leading-relaxed">{item}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
          <AnimateIn delay={0.2} className="hidden lg:block">
            <div className="relative h-[440px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/service-sea.jpg"
                alt="Container ship — DC Logistics Brasil"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/40 to-transparent" />
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
