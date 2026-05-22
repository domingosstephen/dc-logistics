import Link from "next/link";
import { Section } from "@/components/layout/section";

export function CtaBand() {
  return (
    <Section className="bg-pine text-paper">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-paper tracking-tight">
          Pronto per il viaggio del tuo pet?
        </h2>
        <p className="mt-4 text-lg text-paper/60">
          Richiedi un preventivo gratuito e scopri come possiamo prenderci cura
          del tuo animale.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quote"
            className="inline-flex items-center justify-center rounded-full bg-honey px-8 py-3.5 text-base font-semibold text-pine-deep hover:bg-honey/90 transition-colors"
          >
            Richiedi un preventivo
          </Link>
          <Link
            href="/track"
            className="inline-flex items-center justify-center rounded-full border-2 border-paper/30 px-8 py-3.5 text-base font-semibold text-paper hover:bg-paper/10 transition-colors"
          >
            Traccia il tuo pet
          </Link>
        </div>
      </div>
    </Section>
  );
}
