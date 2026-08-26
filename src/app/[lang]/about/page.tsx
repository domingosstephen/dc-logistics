import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    <div>
      {/* Hero banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <Image
          src="/hero-logistics.jpg"
          alt="DC Logistics Brasil — international freight"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-deep/50" />
      </div>

    <div className="mx-auto max-w-[800px] px-5 md:px-8 py-18 md:py-24">
      <h1 className="font-display text-4xl font-semibold text-deep mb-4">
        {isPt ? "Sobre a DC Logistics Brasil" : "About DC Logistics Brasil"}
      </h1>
      <p className="text-steel text-lg mb-16 max-w-xl leading-relaxed">
        {isPt
          ? "Soluções de carga internacional com rastreamento em tempo real e atendimento consultivo do início ao fim."
          : "International freight solutions with real-time tracking and consultative support from start to finish."}
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="font-display text-2xl font-semibold text-deep mb-4">
            {isPt ? "Quem somos" : "Who we are"}
          </h2>
          <p className="text-ink leading-relaxed">
            {isPt
              ? "A DC Logistics Brasil é uma empresa especializada em transporte internacional de cargas, sediada na Rua Cincinato Braga, 340, Sala 162, Bela Vista, São Paulo, SP, CEP 01333-010 (CNPJ 74.182.593/0001-90). Atuamos na importação e exportação entre o Brasil e os principais mercados da América do Norte, Europa, Ásia e América Latina, combinando modal aéreo e marítimo conforme a necessidade de cada operação."
              : "DC Logistics Brasil is a company specialising in international freight transport, headquartered at Rua Cincinato Braga, 340, Sala 162, Bela Vista, São Paulo, SP, CEP 01333-010 (CNPJ 74.182.593/0001-90). We handle imports and exports between Brazil and the main markets in North America, Europe, Asia, and Latin America, combining air and sea freight according to each operation's requirements."}
          </p>
          <p className="text-ink leading-relaxed mt-4">
            {isPt
              ? "Cada envio recebe um número de rastreio exclusivo no formato DCBR, e todo o histórico de etapas — incluindo eventuais retenções e motivos — fica visível no portal de rastreamento. Nosso objetivo é eliminar o silêncio que costuma acompanhar o transporte internacional."
              : "Every shipment receives a unique tracking number in the DCBR format, and the full stage history — including any holds and their reasons — is visible in the tracking portal. Our goal is to eliminate the silence that typically accompanies international freight."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-deep mb-4">
            {isPt ? "O que nos diferencia" : "What sets us apart"}
          </h2>
          <div className="border-t-2 border-t-deep">
            {(isPt
              ? [
                  ["Transparência em tempo real", "Status atualizado manualmente pela equipe a cada mudança de etapa. Quando algo trava, o motivo é registrado — não fica \"em processamento\" por semanas sem explicação."],
                  ["Desembaraço sem surpresas", "Nossa equipe cuida da documentação alfandegária completa, da classificação fiscal (NCM) ao canal de parametrização. Você sabe o que esperar antes do embarque."],
                  ["Acesso direto ao histórico", "Você e seu cliente consultam o rastreamento sem precisar entrar em contato. Toda a sequência de etapas, com data, hora e local, está disponível 24h."],
                  ["Atendimento consultivo", "Não apenas transportamos. Orientamos sobre a melhor rota, modalidade e documentação para cada operação antes de qualquer compromisso."],
                ]
              : [
                  ["Real-time transparency", "Status updated manually by the team at every stage change. When something stalls, the reason is recorded — no weeks of 'processing' without an explanation."],
                  ["No customs surprises", "Our team handles all customs documentation, from tariff classification to parametrisation channel. You know what to expect before dispatch."],
                  ["Direct access to history", "You and your customer check the tracking without needing to contact anyone. The full stage sequence, with date, time, and location, is available 24 h."],
                  ["Consultative support", "We don't just transport. We advise on the best route, mode, and documentation for each operation before any commitment."],
                ]
            ).map(([title, body], i) => (
              <div key={i} className="py-6 border-b border-border flex gap-8">
                <span className="font-mono text-[11px] text-steel shrink-0 pt-0.5">0{i + 1}</span>
                <div>
                  <p className="font-medium text-deep mb-1">{title}</p>
                  <p className="text-sm text-steel leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link
            href={`/${lang}/quote`}
            className="inline-flex h-10 items-center justify-center rounded-md bg-marine px-6 text-sm font-medium text-white hover:bg-marine/90 transition-colors"
          >
            {isPt ? "Solicitar cotação" : "Request a quote"}
          </Link>
          <Link
            href={`/${lang}/contact`}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border px-6 text-sm font-medium text-steel hover:text-ink hover:border-steel transition-colors"
          >
            {isPt ? "Falar com a equipe" : "Talk to the team"}
          </Link>
        </section>

        {/* Certification */}
        <section className="pt-12 border-t border-border">
          <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-6">
            {isPt ? "Certificações" : "Certifications"}
          </p>
          <div className="flex items-center gap-6">
            <Image
              src="/iso-cert.webp"
              alt="ISO 9001 — TÜV Nord Brasil"
              width={140}
              height={140}
              className="rounded-md shrink-0"
            />
            <p className="text-sm text-steel leading-relaxed">
              {isPt
                ? "A DC Logistics Brasil é certificada pela norma ISO 9001:2015, auditada pelo TÜV Nord Brasil, demonstrando compromisso com a qualidade e melhoria contínua dos nossos processos."
                : "DC Logistics Brasil holds ISO 9001:2015 certification, audited by TÜV Nord Brasil, demonstrating our commitment to quality and continuous process improvement."}
            </p>
          </div>
        </section>

        {/* Awards */}
        <section className="pt-12 border-t border-border">
          <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-6">
            {isPt ? "Prêmios" : "Awards"}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Image src="/award-2019.jpg" alt="Prêmio Infraero de Eficiência Logística 2019" width={110} height={110} className="rounded-md" />
            <Image src="/award-2018.jpg" alt="Prêmio Infraero de Eficiência Logística 2018" width={110} height={110} className="rounded-md" />
            <Image src="/award-3.jpg"    alt="Prêmio Infraero de Eficiência Logística 2017" width={110} height={110} className="rounded-md" />
            <p className="text-sm text-steel leading-relaxed max-w-xs">
              {isPt
                ? "Vencedora do Prêmio Infraero de Eficiência Logística em 2017, 2018 e 2019 — reconhecimento pelo desempenho operacional no transporte aéreo internacional."
                : "Winner of the Infraero Logistics Excellence Award in 2017, 2018, and 2019 — recognition for operational performance in international air freight."}
            </p>
          </div>
        </section>

        {/* Sustainability */}
        <section className="pt-12 border-t border-border">
          <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-6">
            {isPt ? "Sustentabilidade" : "Sustainability"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-60 rounded-xl overflow-hidden">
              <Image
                src="/sustainability-1.jpg"
                alt="DC Planting — programa de responsabilidade socioambiental"
                fill
                className="object-cover object-top"
              />
            </div>
            <p className="text-sm text-steel leading-relaxed">
              {isPt
                ? "O programa DC Planting reúne colaboradores e parceiros no plantio de árvores nativas como parte do nosso compromisso com a responsabilidade socioambiental. Acreditamos que eficiência logística e respeito ao meio ambiente caminham juntos."
                : "The DC Planting programme brings together employees and partners to plant native trees as part of our commitment to environmental and social responsibility. We believe operational efficiency and respect for the environment go hand in hand."}
            </p>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}
