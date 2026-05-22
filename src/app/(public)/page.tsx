import { HeroSection } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { CareSection } from "@/components/sections/care";
import { CoveragePreview } from "@/components/sections/coverage-preview";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FaqPreview } from "@/components/sections/faq-preview";
import { CtaBand } from "@/components/sections/cta-band";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <HowItWorksSection />
      <CoveragePreview />
      <CareSection />
      <TestimonialsSection />
      <FaqPreview />
      <CtaBand />
    </>
  );
}
