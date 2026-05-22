import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "La nostra privacy policy per il trasporto di animali domestici.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            Privacy Policy
          </h1>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto prose prose-ink">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Informativa sulla Privacy
          </h2>
          <p className="text-ink/70 leading-relaxed">
            PetVoyage si impegna a proteggere la privacy dei propri clienti. Questa
            informativa descrive come raccogliamo, utilizziamo e proteggiamo i dati
            personali.
          </p>

          <h3 className="font-display text-xl font-semibold text-ink mt-8">
            Dati Raccolti
          </h3>
          <p className="text-ink/70 leading-relaxed">
            Raccogliamo i seguenti dati quando richiedi un preventivo o utilizzi i
            nostri servizi: nome, email, informazioni sul pet (nome, specie, razza),
            e dettagli del viaggio (citta di origine e destinazione).
          </p>

          <h3 className="font-display text-xl font-semibold text-ink mt-8">
            Utilizzo dei Dati
          </h3>
          <p className="text-ink/70 leading-relaxed">
            I dati vengono utilizzati esclusivamente per: fornire i servizi di
            trasporto richiesti, comunicare aggiornamenti sul viaggio del pet,
            rispondere alle richieste di preventivo, e migliorare i nostri servizi.
          </p>

          <h3 className="font-display text-xl font-semibold text-ink mt-8">
            Protezione dei Dati
          </h3>
          <p className="text-ink/70 leading-relaxed">
            Adottiamo misure di sicurezza tecniche e organizzative per proteggere i
            dati personali. I dati di tracciamento sono accessibili solo tramite il
            codice univoco assegnato e non espongono mai informazioni personali del
            cliente.
          </p>

          <h3 className="font-display text-xl font-semibold text-ink mt-8">
            Contatti
          </h3>
          <p className="text-ink/70 leading-relaxed">
            Per domande sulla privacy, contattaci a privacy@petvoyage.eu
          </p>
        </div>
      </Section>
    </>
  );
}
