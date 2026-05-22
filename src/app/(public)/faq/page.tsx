import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqAccordion } from "@/components/faq-accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Domande frequenti sul trasporto pet con PetVoyage.",
};

const faqGroups = [
  {
    category: "Documenti & Requisiti",
    faqs: [
      {
        q: "Quali documenti servono per il trasporto del mio pet?",
        a: "Servono il microchip, le vaccinazioni aggiornate (inclusa l'antirabbica effettuata almeno 21 giorni prima), il certificato sanitario rilasciato dal veterinario e il passaporto EU per animali domestici. Ci occupiamo noi di tutto il processo documentale.",
      },
      {
        q: "Il mio pet ha bisogno del passaporto EU?",
        a: "Si, per viaggiare tra paesi dell'Unione Europea e necessario il passaporto EU per animali domestici. Lo aiutiamo a ottenerlo come parte del nostro servizio.",
      },
      {
        q: "Cosa succede se il mio pet non ha il microchip?",
        a: "Il microchip e obbligatorio per legge per il trasporto di animali nell'UE. Se il tuo pet non ce l'ha ancora, possiamo organizzare l'applicazione con un veterinario certificato prima della partenza.",
      },
    ],
  },
  {
    category: "Il Viaggio",
    faqs: [
      {
        q: "Come viaggia il mio pet?",
        a: "Il tuo pet viaggia in un trasportino confortevole e ventilato, accompagnato da un operatore dedicato. Facciamo soste ogni 4 ore per acqua, cibo e esercizio. La temperatura e controllata durante tutto il tragitto.",
      },
      {
        q: "Quanto tempo dura il viaggio?",
        a: "Dipende dalla rotta. I viaggi all'interno dell'Europa durano generalmente da 1 a 3 giorni. Ti forniamo una stima precisa al momento del preventivo.",
      },
      {
        q: "Il mio pet viaggia da solo?",
        a: "Mai. Un operatore esperto accompagna il tuo pet per tutto il viaggio, garantendo comfort, sicurezza e serenita.",
      },
      {
        q: "Cosa succede in caso di maltempo o emergenze?",
        a: "La sicurezza viene prima. In caso di condizioni avverse, mettiamo in pausa il viaggio e il tuo pet riposa in una struttura sicura e confortevole. Ti aggiorniamo immediatamente.",
      },
    ],
  },
  {
    category: "Tracciamento & Aggiornamenti",
    faqs: [
      {
        q: "Come posso tracciare il viaggio del mio animale?",
        a: "Riceverai un codice di tracciamento unico (es. IT-7H4K-2Q). Inseriscilo nella pagina 'Traccia il tuo Pet' per aggiornamenti in tempo reale sulla posizione e lo stato del tuo animale.",
      },
      {
        q: "Con quale frequenza ricevero aggiornamenti?",
        a: "Pubblichiamo aggiornamenti ad ogni tappa significativa del viaggio: partenza, soste, attraversamento frontiere, arrivo all'hub e consegna finale. Puoi controllare lo stato in qualsiasi momento.",
      },
    ],
  },
  {
    category: "Costi & Prenotazione",
    faqs: [
      {
        q: "Quanto costa il trasporto del mio pet?",
        a: "Il costo dipende dalla rotta, dalla dimensione del pet e dai servizi richiesti. Richiedi un preventivo gratuito e personalizzato compilando il modulo nella pagina 'Richiedi Preventivo'.",
      },
      {
        q: "Come posso prenotare?",
        a: "Compila il modulo di richiesta preventivo sul nostro sito. Ti contatteremo entro 24 ore con un preventivo dettagliato e le prossime fasi.",
      },
      {
        q: "Posso cancellare la prenotazione?",
        a: "Si, puoi cancellare fino a 7 giorni prima della data di partenza per un rimborso completo. Contattaci per i dettagli.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            Domande Frequenti
          </h1>
          <p className="mt-4 text-lg text-paper/60 max-w-xl mx-auto">
            Tutto quello che devi sapere sul trasporto del tuo pet
          </p>
        </div>
      </section>

      {faqGroups.map((group) => (
        <Section key={group.category} className="odd:bg-mist">
          <SectionHeader title={group.category} />
          <div className="max-w-2xl mx-auto">
            <FaqAccordion faqs={group.faqs} />
          </div>
        </Section>
      ))}

      <CtaBand />
    </>
  );
}
