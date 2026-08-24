import { ManifestRail } from "@/components/tracking/manifest-rail";
import { RAIL_STAGES, type RailStatus } from "@/types/database";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function HowItWorksSection({ dict, lang }: Props) {
  // Build labels for the illustrative rail
  const railLabels = Object.fromEntries(
    RAIL_STAGES.map((s) => [s, dict.status[s as keyof typeof dict.status]])
  ) as Record<RailStatus, string>;

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-24 md:py-32">
        <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-4">
          {dict.howItWorks.eyebrow}
        </p>
        <h2 className="font-display text-3xl font-semibold text-deep mb-4">
          {dict.howItWorks.heading}
        </h2>
        <p className="text-steel max-w-xl mb-12">
          {dict.howItWorks.body}
        </p>

        {/* Illustrative manifest rail */}
        <div className="bg-surface rounded-lg border border-border p-6 md:p-8">
          <ManifestRail
            status="in_transit"
            labels={railLabels}
            variant="full"
          />
          <p className="mt-6 text-center font-mono text-[11px] tracking-widest text-steel uppercase">
            {dict.howItWorks.railCaption}
          </p>
        </div>
      </div>
    </section>
  );
}
