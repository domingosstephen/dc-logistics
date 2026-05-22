import { notFound } from "next/navigation";
import { hasLocale } from "../dictionaries";
import { Section } from "@/components/layout/section";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const title = lang === "de" ? "Datenschutzerklarung" : lang === "es" ? "Politica de Privacidad" : "Privacy Policy";

  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">{title}</h1>
        </div>
      </section>
      <Section>
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-ink/70 leading-relaxed">
            {lang === "it" ? "InfoAnimaleCarico si impegna a proteggere la privacy dei propri clienti." : lang === "de" ? "InfoAnimaleCarico verpflichtet sich zum Schutz der Privatsphare seiner Kunden." : lang === "es" ? "InfoAnimaleCarico se compromete a proteger la privacidad de sus clientes." : "InfoAnimaleCarico is committed to protecting the privacy of its customers."}
          </p>
          <p className="text-ink/70 leading-relaxed">
            {lang === "it" ? "Raccogliamo nome, email, informazioni sul pet e dettagli del viaggio quando richiedi un preventivo." : lang === "de" ? "Wir erfassen Name, E-Mail, Tierinformationen und Reisedetails bei Angebotsanfragen." : lang === "es" ? "Recopilamos nombre, email, informacion de la mascota y detalles del viaje al solicitar un presupuesto." : "We collect name, email, pet information, and journey details when you request a quote."}
          </p>
          <p className="text-ink/70 leading-relaxed">
            {lang === "it" ? "I dati di tracciamento sono accessibili solo tramite il codice univoco e non espongono informazioni personali." : lang === "de" ? "Tracking-Daten sind nur uber den Code zuganglich und enthalten keine personlichen Daten." : lang === "es" ? "Los datos de rastreo solo son accesibles con el codigo unico y no exponen informacion personal." : "Tracking data is only accessible via the unique code and never exposes personal information."}
          </p>
          <p className="text-ink/70 leading-relaxed">
            {lang === "it" ? "Contatti:" : lang === "de" ? "Kontakt:" : lang === "es" ? "Contacto:" : "Contact:"} privacy@infoanimalecarico.com
          </p>
        </div>
      </Section>
    </>
  );
}
