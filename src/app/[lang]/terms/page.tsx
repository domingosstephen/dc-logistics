import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";

interface Props { params: Promise<{ lang: string }> }

export default async function TermsPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const isPt = lang === "pt";

  return (
    <main className="mx-auto max-w-[800px] px-5 md:px-8 py-18 md:py-24">
      <h1 className="font-display text-4xl font-semibold text-deep mb-3">{dict.legal.termsH1}</h1>
      <p className="text-sm text-steel mb-12">
        {isPt ? "Atualizado em agosto de 2025." : "Last updated August 2025."}
      </p>

      <div className="space-y-10">

        <section>
          <p className="text-sm text-steel leading-relaxed bg-surface border border-border rounded-md px-4 py-3">
            {isPt
              ? "Estes termos regulam a relação entre o cliente e a DC Logistics Brasil Ltda., inscrita no CNPJ sob o n.º 74.182.593/0001-90, com sede na Rua Cincinato Braga, 340, Sala 162, Bela Vista, São Paulo, SP, CEP 01333-010, Brasil."
              : "These terms govern the relationship between the client and DC Logistics Brasil Ltda., registered under CNPJ 74.182.593/0001-90, headquartered at Rua Cincinato Braga, 340, Sala 162, Bela Vista, São Paulo, SP, CEP 01333-010, Brazil."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "1. Contratação e cotação" : "1. Quoting and contracting"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "A solicitação de cotação não constitui reserva de espaço nem contrato de transporte. O contrato de prestação de serviços é formalizado somente após a emissão e aceitação do conhecimento de carga (AWB ou B/L) ou instrumento equivalente pela DC Logistics Brasil Ltda. Valores e prazos em cotações têm validade de 5 dias úteis, salvo indicação expressa em contrário."
              : "A quote request does not constitute a booking or contract of carriage. The service contract is formalised only once a bill of lading, air waybill, or equivalent instrument issued by DC Logistics Brasil Ltda. has been accepted. Rates and transit times in quotes are valid for 5 business days unless otherwise stated."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "2. Responsabilidades do cliente" : "2. Client responsibilities"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "O cliente é responsável pela correta descrição da mercadoria, pela precisão das informações fiscais (classificação NCM, valor aduaneiro, país de origem) e pelo cumprimento de toda a regulamentação aplicável no país de origem e de destino. Declarações incorretas que resultem em multa, retenção ou extravio são de exclusiva responsabilidade do declarante."
              : "The client is responsible for the accurate description of goods, correctness of fiscal information (tariff classification, customs value, country of origin), and compliance with all applicable regulations in the country of origin and destination. Incorrect declarations resulting in fines, holds, or loss are solely the responsibility of the declarant."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "3. Itens proibidos e restritos" : "3. Prohibited and restricted items"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "A lista de itens proibidos e restritos está disponível na página Itens proibidos. A DC Logistics reserva o direito de recusar, reter ou devolver qualquer carga que contenha materiais proibidos ou não esteja em conformidade com as normas aduaneiras aplicáveis, sem direito a reembolso das tarifas já cobradas."
              : "The list of prohibited and restricted items is on the Prohibited items page. DC Logistics reserves the right to refuse, hold, or return any cargo containing prohibited materials or not compliant with applicable customs regulations, without entitlement to a refund of any fees already charged."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "4. Prazos de entrega" : "4. Transit times"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "Os prazos indicados em cotações e conhecimentos de carga são estimativas baseadas nas condições normais de operação. A DC Logistics não se responsabiliza por atrasos decorrentes de greves, condições climáticas, retenção alfandegária por causas alheias à empresa, pandemias ou quaisquer eventos fora de seu controle direto."
              : "Transit times stated in quotes and shipping documents are estimates based on normal operating conditions. DC Logistics is not liable for delays caused by strikes, weather conditions, customs holds for reasons outside the company's control, pandemics, or any events beyond its direct control."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "5. Cobertura e responsabilidade por danos" : "5. Coverage and liability for damage"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "Todos os envios possuem cobertura básica contra extravio e avaria total, limitada ao valor declarado na documentação de transporte e sujeita aos limites da Convenção de Varsóvia, Protocolo de Montreal ou CMR conforme a modalidade. Cobertura adicional pode ser contratada mediante solicitação prévia ao embarque. Não são cobertos danos intrínsecos, embalagem inadequada, desgaste natural ou itens não declarados."
              : "All shipments include basic coverage against total loss and total damage, limited to the declared value in the transport documentation and subject to limits under the Warsaw Convention, Montreal Protocol, or CMR as applicable by mode. Additional coverage may be arranged on request before dispatch. Intrinsic damage, inadequate packaging, natural wear, and undeclared items are not covered."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "6. Rastreamento e portal do cliente" : "6. Tracking and client portal"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "O portal de rastreamento é fornecido gratuitamente como serviço complementar. A DC Logistics empenha esforços razoáveis para manter o portal disponível, mas não garante disponibilidade ininterrupta. As credenciais de acesso ao painel do cliente são pessoais e intransferíveis. O cliente é responsável por sua guarda e por qualquer uso indevido realizado com suas credenciais."
              : "The tracking portal is provided free of charge as a supplementary service. DC Logistics makes reasonable efforts to keep the portal available but does not guarantee uninterrupted availability. Client dashboard credentials are personal and non-transferable. The client is responsible for their safekeeping and for any misuse carried out with their credentials."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "7. Foro e lei aplicável" : "7. Governing law and jurisdiction"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "Estes termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca de São Paulo, SP, para dirimir quaisquer litígios decorrentes da prestação dos serviços, com exclusão de qualquer outro, por mais privilegiado que seja."
              : "These terms are governed by Brazilian law. The courts of São Paulo, SP, Brazil, shall have exclusive jurisdiction over any disputes arising from the provision of services."}
          </p>
        </section>

      </div>
    </main>
  );
}
