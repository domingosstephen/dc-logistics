import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";

interface Props { params: Promise<{ lang: string }> }

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const isPt = lang === "pt";

  return (
    <main className="mx-auto max-w-[800px] px-5 md:px-8 py-18 md:py-24">
      <h1 className="font-display text-4xl font-semibold text-deep mb-3">{dict.legal.privacyH1}</h1>
      <p className="text-sm text-steel mb-12">
        {isPt ? "Atualizado em agosto de 2025." : "Last updated August 2025."}
      </p>

      <div className="space-y-10">

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "1. Quem somos" : "1. Who we are"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "A DC Logistics Brasil Ltda., sediada em São Paulo, SP, Brasil, é a controladora dos dados pessoais coletados por meio deste site e dos serviços de transporte internacional que presta. Para questões relativas à privacidade, escreva para contato@dclogisticsbrasil.com.br."
              : "DC Logistics Brasil Ltda., headquartered in São Paulo, SP, Brazil, is the controller of personal data collected through this website and the international freight services it provides. For privacy-related questions, email contato@dclogisticsbrasil.com.br."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "2. Dados que coletamos" : "2. Data we collect"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "Coletamos dados que você nos fornece diretamente (nome, e-mail, telefone, empresa, endereço de entrega, descrição da mercadoria e valor declarado) ao solicitar uma cotação, contratar um serviço ou entrar em contato. Também coletamos dados de rastreamento de e-mails de atualização de envio quando você opta por seguir um envio."
              : "We collect data you provide directly to us — name, email, phone, company, delivery address, goods description, and declared value — when requesting a quote, contracting a service, or contacting us. We also collect email open data when you opt in to shipment update emails."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "3. Como usamos seus dados" : "3. How we use your data"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "Usamos seus dados para: (a) prestar os serviços de transporte contratados; (b) enviar atualizações de status do envio quando você optou por segui-lo; (c) responder a solicitações de cotação e mensagens de contato; (d) cumprir obrigações legais e fiscais, incluindo os requisitos da Receita Federal do Brasil. Não vendemos seus dados a terceiros."
              : "We use your data to: (a) provide the contracted transport services; (b) send shipment status updates when you have opted in to follow a shipment; (c) respond to quote requests and contact messages; (d) comply with legal and fiscal obligations, including those of the Brazilian Federal Revenue Service. We do not sell your data to third parties."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "4. Compartilhamento de dados" : "4. Data sharing"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "Seus dados podem ser compartilhados com: transportadoras e agentes aduaneiros envolvidos na execução do serviço contratado; autoridades alfandegárias e fiscais, quando exigido por lei; prestadores de serviços de tecnologia que operam em nosso nome (hospedagem, banco de dados, e-mail transacional), todos sujeitos a obrigações de confidencialidade."
              : "Your data may be shared with: carriers and customs agents involved in carrying out the contracted service; customs and tax authorities when required by law; technology service providers acting on our behalf (hosting, database, transactional email), all subject to confidentiality obligations."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "5. Retenção de dados" : "5. Data retention"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "Mantemos seus dados pelo tempo necessário para a execução do contrato e para o cumprimento das obrigações legais. Documentos fiscais são mantidos pelo prazo mínimo de 5 anos exigido pela legislação brasileira. Dados de seguidores de envio são excluídos quando você cancela a assinatura."
              : "We retain your data for as long as necessary to perform the contract and to comply with legal obligations. Tax documents are retained for a minimum of 5 years as required by Brazilian law. Shipment follower data is deleted when you unsubscribe."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "6. Seus direitos (LGPD)" : "6. Your rights (LGPD)"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "Nos termos da Lei Geral de Proteção de Dados (Lei n.º 13.709/2018), você tem direito a: confirmar a existência de tratamento; acessar seus dados; corrigir dados incompletos ou desatualizados; solicitar a anonimização, bloqueio ou eliminação de dados desnecessários; revogar o consentimento; e opor-se ao tratamento. Para exercer esses direitos, escreva para contato@dclogisticsbrasil.com.br."
              : "Under the Brazilian General Data Protection Law (Lei n. 13.709/2018 — LGPD), you have the right to: confirm the existence of processing; access your data; correct incomplete or outdated data; request anonymisation, blocking, or deletion of unnecessary data; revoke consent; and object to processing. To exercise these rights, email contato@dclogisticsbrasil.com.br."}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-deep mb-3">
            {isPt ? "7. Cookies e rastreamento" : "7. Cookies and tracking"}
          </h2>
          <p className="text-steel leading-relaxed">
            {isPt
              ? "Este site utiliza cookies técnicos necessários para o funcionamento do portal de rastreamento e do painel do cliente. Não utilizamos cookies de rastreamento publicitário ou de terceiros. Números de rastreio salvos na página de rastreamento são armazenados exclusivamente no seu navegador (localStorage) e nunca são enviados ao servidor sem sua ação explícita."
              : "This website uses technical cookies necessary for the operation of the tracking portal and client dashboard. We do not use advertising or third-party tracking cookies. Tracking numbers saved on the tracking page are stored exclusively in your browser (localStorage) and are never sent to the server without your explicit action."}
          </p>
        </section>

      </div>
    </main>
  );
}
