import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";

interface Props {
  params: Promise<{ lang: string }>;
}

interface Service {
  title: string;
  body: string;
  highlight: string;
  image?: string;
  imageAlt?: string;
}

const SERVICES_PT: Service[] = [
  {
    title: "Carga Aérea Internacional",
    body: "Exportação e importação por via aérea com transporte consolidado (LCL) ou exclusivo. Transit time de 3 a 10 dias úteis dependendo do destino. Indicado para cargas urgentes, de alto valor ou que exijam controle rígido de temperatura.",
    highlight: "3–10 dias úteis",
    image: "/service-air.jpg",
    imageAlt: "Aviões em pátio aeroportuário ao pôr do sol",
  },
  {
    title: "Carga Marítima",
    body: "Exportação e importação por via marítima em contêiner completo (FCL) ou carga fracionada (LCL). A solução mais econômica para grandes volumes. Atendemos os principais portos da Europa, Ásia, América do Norte e América Latina.",
    highlight: "Melhor custo-benefício",
    image: "/service-sea.jpg",
    imageAlt: "Navio porta-contêineres visto de cima",
  },
  {
    title: "Desembaraço Aduaneiro",
    body: "Assessoria completa nos processos de importação e exportação: classificação fiscal (NCM), licenciamento, canal de parametrização e liberação alfandegária. Trabalhamos com DI, DU-E, LI, RE e demais documentos exigidos pela Receita Federal.",
    highlight: "Importação e exportação",
  },
  {
    title: "Door-to-Door",
    body: "Coleta no endereço do remetente, transporte internacional e entrega no endereço final do destinatário. Cada etapa é registrada com data, hora e local no nosso portal de rastreamento. Você e seu cliente acompanham em tempo real.",
    highlight: "Rastreamento completo",
  },
  {
    title: "Courier Internacional",
    body: "Envio de volumes menores com rapidez e rastreamento. Ideal para amostras comerciais, documentos, peças de reposição e mercadorias com prazo curto de entrega. Atendemos mais de 50 destinos.",
    highlight: "Mais de 50 destinos",
  },
  {
    title: "Cargas Especiais",
    body: "Tratamos cargas que exigem cuidado diferenciado: perecíveis com temperatura controlada, carga perigosa (DG/IMDG), obras de arte, equipamentos sensíveis e oversized. Consulte a equipe para orientação antes do embarque.",
    highlight: "Sob consulta",
  },
];

const SERVICES_EN: Service[] = [
  {
    title: "International Air Freight",
    body: "Import and export by air on consolidated (LCL) or exclusive basis. Transit time of 3 to 10 business days depending on destination. Recommended for urgent, high-value, or temperature-sensitive cargo.",
    highlight: "3–10 business days",
    image: "/service-air.jpg",
    imageAlt: "Aircraft at airport apron at sunset",
  },
  {
    title: "Sea Freight",
    body: "Import and export by sea in full container loads (FCL) or grouped shipments (LCL). The most cost-effective solution for large volumes. We serve major ports in Europe, Asia, North America, and Latin America.",
    highlight: "Best value for volume",
    image: "/service-sea.jpg",
    imageAlt: "Aerial view of container ship at sea",
  },
  {
    title: "Customs Clearance",
    body: "Full advisory for import and export procedures: tariff classification, licensing, parametrisation channel, and customs release. We handle all required documentation including import/export declarations and licences.",
    highlight: "Import and export",
  },
  {
    title: "Door-to-Door",
    body: "Collection from the sender's address, international transport, and delivery to the final recipient. Every stage is logged with date, time, and location in our tracking portal. You and your customer follow in real time.",
    highlight: "Full tracking",
  },
  {
    title: "International Courier",
    body: "Faster delivery for smaller volumes with end-to-end tracking. Ideal for commercial samples, documents, spare parts, and goods with a short delivery deadline. We reach more than 50 destinations.",
    highlight: "50+ destinations",
  },
  {
    title: "Special Cargo",
    body: "We handle cargo requiring extra care: temperature-controlled perishables, hazardous goods (DG/IMDG), works of art, sensitive equipment, and oversized shipments. Consult the team for guidance before dispatch.",
    highlight: "On request",
  },
];

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const isPt = lang === "pt";
  const services = isPt ? SERVICES_PT : SERVICES_EN;

  return (
    <main className="mx-auto max-w-[1200px] px-5 md:px-8 py-18 md:py-24">
      <h1 className="font-display text-4xl font-semibold text-deep mb-4">
        {dict.servicesPage.h1}
      </h1>
      <p className="text-steel mb-16 max-w-2xl text-lg leading-relaxed">
        {dict.servicesPage.intro}
      </p>

      <div className="border-t-2 border-t-deep divide-y divide-border">
        {services.map((service) => (
          <div key={service.title} className="py-8 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 md:gap-16">
            <div>
              <h2 className="font-display text-xl font-semibold text-deep mb-1">
                {service.title}
              </h2>
              <span className="font-mono text-[11px] tracking-widest text-marine uppercase">
                {service.highlight}
              </span>
            </div>
            <div className="space-y-4">
              {service.image && (
                <div className="relative w-full h-44 rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt ?? service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-steel leading-relaxed">{service.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-steel">{dict.servicesPage.closing}</p>
        <Link
          href={`/${lang}/quote`}
          className="inline-flex h-10 items-center rounded-md bg-marine px-5 text-sm font-medium text-white hover:bg-marine/90 transition-colors shrink-0"
        >
          {isPt ? "Solicitar cotação →" : "Request a quote →"}
        </Link>
      </div>
    </main>
  );
}
