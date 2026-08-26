import Image from "next/image";
import { ManifestRail } from "@/components/tracking/manifest-rail";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/motion/animate-in";
import { RAIL_STAGES, type RailStatus } from "@/types/database";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const STEPS_PT = [
  { n: "01", title: "Registro",       body: "Seu envio recebe um número DCBR único. Você recebe por e-mail." },
  { n: "02", title: "Coleta",         body: "A carga é recebida no nosso armazém e conferida." },
  { n: "03", title: "Processamento",  body: "Documentação verificada, embalagem inspecionada, DU-E gerada." },
  { n: "04", title: "Exportação",     body: "Desembaraço aduaneiro na origem — parametrização e liberação." },
  { n: "05", title: "Em trânsito",    body: "Voo ou navio a caminho. Você acompanha no portal 24h." },
  { n: "06", title: "Importação",     body: "Desembaraço no país de destino — liberação alfandegária." },
  { n: "07", title: "Saiu p/ entrega", body: "Carga nas mãos da transportadora local para entrega final." },
  { n: "08", title: "Entregue",       body: "Confirmação de entrega registrada. Histórico completo disponível." },
];
const STEPS_EN = [
  { n: "01", title: "Registered",     body: "Your shipment gets a unique DCBR number, sent to you by email." },
  { n: "02", title: "Received",       body: "Cargo received at our warehouse and inspected." },
  { n: "03", title: "Processing",     body: "Documentation verified, packaging inspected, export declaration filed." },
  { n: "04", title: "Export customs", body: "Export clearance at origin — channel assessment and release." },
  { n: "05", title: "In transit",     body: "On the plane or vessel. Track it in the portal 24 h a day." },
  { n: "06", title: "Import customs", body: "Customs clearance at destination — local regulatory release." },
  { n: "07", title: "Out for delivery", body: "Cargo handed to the local carrier for final-mile delivery." },
  { n: "08", title: "Delivered",      body: "Delivery confirmed and logged. Full history available." },
];

export function HowItWorksSection({ dict, lang }: Props) {
  const railLabels = Object.fromEntries(
    RAIL_STAGES.map((s) => [s, dict.status[s as keyof typeof dict.status]])
  ) as Record<RailStatus, string>;

  const steps = lang === "pt" ? STEPS_PT : STEPS_EN;

  return (
    <section className="border-b border-border bg-mist">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-24 md:py-32">
        <AnimateIn>
          <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-4">
            {dict.howItWorks.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-semibold text-deep mb-4">
            {dict.howItWorks.heading}
          </h2>
          <p className="text-steel max-w-xl mb-10">{dict.howItWorks.body}</p>
        </AnimateIn>

        {/* Warehouse photo */}
        <AnimateIn delay={0.1}>
          <div className="relative w-full h-56 rounded-xl overflow-hidden mb-12">
            <Image
              src="/warehouse.jpg"
              alt="DC Logistics Brasil — warehouse operations"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-deep/30 to-transparent" />
          </div>
        </AnimateIn>

        {/* Step grid */}
        <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden mb-12" staggerDelay={0.07}>
          {steps.map((step) => (
            <StaggerItem key={step.n}>
              <div className="bg-surface p-5 h-full group hover:bg-marine/5 transition-colors duration-200">
                <span className="font-mono text-[11px] tracking-widest text-marine uppercase">{step.n}</span>
                <p className="font-display text-sm font-semibold text-deep mt-1 mb-2">{step.title}</p>
                <p className="text-xs text-steel leading-relaxed">{step.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Illustrative rail */}
        <AnimateIn delay={0.2}>
          <div className="bg-surface rounded-xl border border-border p-6 md:p-8">
            <ManifestRail status="in_transit" labels={railLabels} variant="full" />
            <p className="mt-6 text-center font-mono text-[11px] tracking-widest text-steel uppercase">
              {dict.howItWorks.railCaption}
            </p>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
