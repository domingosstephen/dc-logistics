import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import type { Locale } from "./dictionaries";
import { HeroSection } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { CareSection } from "@/components/sections/care";
import { CoveragePreview } from "@/components/sections/coverage-preview";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FaqPreview } from "@/components/sections/faq-preview";
import { CtaBand } from "@/components/sections/cta-band";
import { PawDivider } from "@/components/motion/paw-divider";

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
      <TrustBar dict={dict} />
      <HowItWorksSection dict={dict} />
      <PawDivider />
      <CoveragePreview lang={lang as Locale} dict={dict} />
      <CareSection dict={dict} />
      <PawDivider variant="light" />
      <TestimonialsSection dict={dict} />
      <FaqPreview lang={lang as Locale} dict={dict} />
      <CtaBand lang={lang as Locale} dict={dict} />
    </>
  );
}
