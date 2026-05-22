import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { TrackingResult } from "@/components/tracking/tracking-result";
import { TrackingSearch } from "@/components/tracking/tracking-search";
import type { PublicShipment } from "@/types/database";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Tracciamento ${decodeURIComponent(code)}`,
    description: `Segui il viaggio del tuo pet con il codice ${decodeURIComponent(code)}`,
  };
}

async function getShipment(code: string): Promise<PublicShipment | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc("get_shipment_by_code", {
    p_code: code,
  });
  if (error || !data) return null;
  return data as unknown as PublicShipment;
}

export default async function TrackingCodePage({ params }: Props) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);
  const shipment = await getShipment(decodedCode);

  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            Traccia il Tuo Pet
          </h1>
          <p className="mt-4 text-lg text-paper/60 max-w-xl mx-auto">
            Codice: <span className="font-mono text-honey">{decodedCode}</span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-8 mb-20">
        {shipment ? (
          <TrackingResult shipment={shipment} code={decodedCode} />
        ) : (
          <div className="bg-paper rounded-2xl shadow-[var(--shadow-soft)] p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-honey/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-honey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-ink mb-2">
              Codice non trovato
            </h2>
            <p className="text-ink/60 text-sm mb-8">
              Non abbiamo trovato quel codice. Controlla e riprova, oppure contattaci.
            </p>
            <TrackingSearch />
          </div>
        )}
      </div>
    </>
  );
}
