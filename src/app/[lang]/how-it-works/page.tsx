import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { CareSection } from "@/components/sections/care";
import { CtaBand } from "@/components/sections/cta-band";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function HowItWorksPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            {dict.howItWorks.title}
          </h1>
        </div>
      </section>
      <HowItWorksSection dict={dict} />
      <CareSection dict={dict} />
      <CtaBand lang={lang as Locale} dict={dict} />
    </>
  );
}
