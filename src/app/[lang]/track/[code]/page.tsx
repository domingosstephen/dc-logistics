import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getDictionary, hasLocale } from "../../dictionaries";
import type { Locale } from "../../dictionaries";
import { TrackingResult } from "@/components/tracking/tracking-result";
import { TrackingSearch } from "@/components/tracking/tracking-search";
import { normaliseTrackingCode } from "@/lib/tracking-code";
import type { PublicShipment, PublicShipmentResult } from "@/types/database";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string; code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: decodeURIComponent(code),
  };
}

async function getShipment(code: string): Promise<PublicShipment | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc("get_shipment_by_code", {
    p_code: normaliseTrackingCode(code),
  });
  if (error || !data) return null;
  const result = data as unknown as PublicShipmentResult;
  return result.found ? (result as PublicShipment) : null;
}

export default async function TrackingCodePage({ params }: Props) {
  const { lang, code } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const decodedCode = decodeURIComponent(code);
  const shipment = await getShipment(decodedCode);

  return (
    <main className="mx-auto max-w-[1200px] px-5 md:px-8 py-18 md:py-24 space-y-8">
      {shipment ? (
        <TrackingResult
          shipment={shipment}
          code={decodedCode}
          lang={lang as Locale}
          dict={dict}
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-surface rounded-lg border border-border p-8 md:p-10">
            <p className="font-mono text-sm text-steel mb-2">{decodedCode}</p>
            <p className="text-ink">{dict.tracking.notFoundText}</p>
          </div>
          <TrackingSearch lang={lang as Locale} dict={dict} multi />
        </div>
      )}
    </main>
  );
}
