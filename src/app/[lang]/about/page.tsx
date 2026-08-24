import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  await getDictionary(lang as Locale);

  const isPt = lang === "pt";

  return (
    <div className="mx-auto max-w-[800px] px-5 md:px-8 py-18 md:py-24">
      <h1 className="font-display text-4xl font-semibold text-deep mb-4">
        {isPt ? "Sobre a DC Logistics Brasil" : "About DC Logistics Brasil"}
      </h1>
      <p className="text-steel text-lg mb-12 max-w-xl">
        {isPt
          ? "Soluções de carga internacional com foco em transparência e rastreabilidade."
          : "International freight solutions focused on transparency and traceability."}
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="font-display text-2xl font-semibold text-deep mb-4">
            {isPt ? "Quem somos" : "Who we are"}
          </h2>
          <p className="text-ink leading-relaxed">
            {isPt
              ? "A DC Logistics Brasil é uma empresa especializada em transporte internacional de cargas. Atuamos com importação e exportação entre o Brasil e os principais mercados globais, oferecendo rastreamento em tempo real e atendimento consultivo em cada etapa do processo."
              : "DC Logistics Brasil is a company specialising in international freight transport. We handle imports and exports between Brazil and major global markets, offering real-time tracking and consultative support at every stage of the process."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-deep mb-4">
            {isPt ? "Nossa missão" : "Our mission"}
          </h2>
          <p className="text-ink leading-relaxed">
            {isPt
              ? "Tornar o comércio internacional acessível a empresas de todos os tamanhos, com processos claros, custos previsíveis e total visibilidade sobre a carga."
              : "Make international trade accessible to businesses of all sizes, with clear processes, predictable costs, and full visibility over the cargo."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-deep mb-4">
            {isPt ? "O que nos diferencia" : "What sets us apart"}
          </h2>
          <ul className="space-y-4">
            {(isPt
              ? [
                  ["Rastreamento em tempo real", "Cada evento da sua carga é registrado e visível imediatamente no portal de rastreio."],
                  ["Documentação simplificada", "Nossa equipe cuida de toda a burocracia alfandegária para que você foque no seu negócio."],
                  ["Atendimento consultivo", "Não apenas transportamos — orientamos sobre a melhor rota, modalidade e documentação para cada operação."],
                ]
              : [
                  ["Real-time tracking", "Every event on your cargo is recorded and immediately visible on the tracking portal."],
                  ["Simplified documentation", "Our team handles all customs paperwork so you can focus on your business."],
                  ["Consultative service", "We don't just transport — we advise on the best route, mode, and documentation for each operation."],
                ]
            ).map(([title, body]) => (
              <li key={title} className="border-l-2 border-marine pl-4">
                <p className="font-medium text-deep">{title}</p>
                <p className="text-sm text-steel mt-1">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Placeholder for client-supplied information */}
        <section className="bg-surface rounded-lg border border-border p-6">
          <p className="text-sm text-steel italic">
            {isPt
              ? "[Informações adicionais sobre a empresa, equipe, certificações e parceiros serão adicionadas pelo cliente.]"
              : "[Additional information about the company, team, certifications, and partners will be added by the client.]"}
          </p>
        </section>
      </div>
    </div>
  );
}
