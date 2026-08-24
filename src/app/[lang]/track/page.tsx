import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import { TrackingSearch } from "@/components/tracking/tracking-search";
import { SavedNumbers } from "@/components/tracking/saved-numbers";
import { createServerClient } from "@/lib/supabase/server";
import { ManifestRail } from "@/components/tracking/manifest-rail";
import {
  RAIL_STAGES,
  type PublicShipment,
  type PublicShipmentResult,
  type RailStatus,
} from "@/types/database";
import { normaliseTrackingCode } from "@/lib/tracking-code";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ codes?: string }>;
}

export default async function TrackPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { codes: rawCodes } = await searchParams;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const locale = lang === "pt" ? "pt-BR" : "en-GB";

  // Multi-number lookup
  if (rawCodes) {
    const codeList = rawCodes
      .split(",")
      .map((c) => normaliseTrackingCode(c))
      .filter(Boolean)
      .slice(0, 20);

    const supabase = createServerClient();
    const results = await Promise.all(
      codeList.map(async (code) => {
        const { data } = await supabase.rpc("get_shipment_by_code", { p_code: code });
        return { code, result: (data as unknown as PublicShipmentResult) ?? { found: false } };
      })
    );

    const found = results.filter((r) => r.result.found).length;
    const notFound_ = results.length - found;
    const railLabels = Object.fromEntries(
      RAIL_STAGES.map((s) => [s, dict.status[s as keyof typeof dict.status]])
    ) as Record<RailStatus, string>;

    return (
      <main className="mx-auto max-w-[1200px] px-5 md:px-8 py-18 md:py-24 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-deep">
            {dict.tracking.resultsHeading.replace("{n}", String(results.length))}
          </h1>
          {notFound_ > 0 && (
            <p className="text-sm text-steel mt-1">
              {dict.tracking.partialNote
                .replace("{n}", String(notFound_))
                .replace("{total}", String(results.length))}
            </p>
          )}
        </div>

        <div className="divide-y divide-border border-t-2 border-t-deep border-b border-b-border">
          {results.map(({ code, result }) =>
            result.found ? (
              <MultiResultRow
                key={code}
                shipment={result as PublicShipment}
                railLabels={railLabels}
                dict={dict}
                lang={lang as Locale}
                locale={locale}
              />
            ) : (
              <div key={code} className="py-4 flex items-center gap-4">
                <span className="font-mono text-sm text-steel">{code}</span>
                <span className="text-sm text-steel">{dict.tracking.rowNotFound}</span>
              </div>
            )
          )}
        </div>

        <TrackingSearch lang={lang as Locale} dict={dict} multi />
      </main>
    );
  }

  // Single / empty
  return (
    <main className="mx-auto max-w-[1200px] px-5 md:px-8 py-18 md:py-24 space-y-10">
      <div>
        <h1 className="font-display text-4xl font-semibold text-deep">
          {dict.tracking.h1}
        </h1>
        <p className="mt-3 text-steel">{dict.tracking.intro}</p>
      </div>
      <TrackingSearch lang={lang as Locale} dict={dict} multi />
      <SavedNumbers lang={lang} />
    </main>
  );
}

function MultiResultRow({
  shipment,
  railLabels,
  dict,
  lang,
  locale,
}: {
  shipment: PublicShipment;
  railLabels: Record<RailStatus, string>;
  dict: ReturnType<typeof getDictionary> extends Promise<infer T> ? T : never;
  lang: Locale;
  locale: string;
}) {
  const { tracking_code, status, destination_city, destination_country, pieces } = shipment;
  const latestEvent = shipment.events[shipment.events.length - 1];
  const lastDate = latestEvent
    ? new Date(latestEvent.happened_at).toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="py-4 flex flex-wrap md:flex-nowrap items-center gap-x-6 gap-y-2">
      <a
        href={`/${lang}/track/${encodeURIComponent(tracking_code)}`}
        className="font-mono text-sm text-marine hover:underline shrink-0"
      >
        {tracking_code}
      </a>
      <span className="text-sm text-steel shrink-0">
        {destination_city}, {destination_country}
      </span>
      <span className="text-sm text-steel shrink-0">
        {dict.tracking.pieces.replace("{n}", String(pieces))}
      </span>
      <ManifestRail
        status={status}
        labels={railLabels}
        variant="condensed"
        className="shrink-0"
      />
      <span className="text-xs text-steel font-mono shrink-0">{lastDate}</span>
    </div>
  );
}
