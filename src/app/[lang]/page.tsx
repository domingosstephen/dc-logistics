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

function WhatWeDoSection({ dict, lang }: { dict: Awaited<ReturnType<typeof getDictionary>>; lang: Locale }) {
  return (
    <section className="mx-auto max-w-[1200px] px-5 md:px-8 py-24 md:py-32">
      <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-4">
        {dict.services.eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold text-deep mb-8">
        {dict.services.heading}
      </h2>
      <p className="text-steel italic">{dict.services.cards}</p>
      <div className="mt-6">
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
