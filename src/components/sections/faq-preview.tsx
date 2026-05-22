"use client";

import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quali documenti servono per il trasporto del mio pet?",
    a: "Servono il microchip, le vaccinazioni aggiornate (inclusa l'antirabbica), il certificato sanitario e il passaporto EU per animali. Ci occupiamo noi di tutto il processo documentale.",
  },
  {
    q: "Come posso tracciare il viaggio del mio animale?",
    a: "Riceverai un codice di tracciamento unico. Inseriscilo nella pagina 'Traccia il tuo Pet' per vedere aggiornamenti in tempo reale sulla posizione e lo stato del tuo animale.",
  },
  {
    q: "Il mio pet viaggia da solo?",
    a: "Mai. Un operatore esperto e dedicato accompagna il tuo pet durante tutto il viaggio, garantendo comfort, sicurezza e tanto amore.",
  },
  {
    q: "Quanto tempo dura il viaggio?",
    a: "Dipende dalla rotta. I viaggi all'interno dell'Europa durano generalmente da 1 a 3 giorni, con soste di riposo programmate ogni 4 ore.",
  },
];

export function FaqPreview() {
  return (
    <Section className="bg-mist">
      <SectionHeader title="Domande Frequenti" />
      <div className="max-w-2xl mx-auto">
        <Accordion className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              className="bg-paper rounded-xl border-none px-6"
            >
              <AccordionTrigger className="text-left font-medium text-ink hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-ink/60 text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="text-pine font-medium hover:text-pine-deep transition-colors"
          >
            Vedi tutte le FAQ &rarr;
          </Link>
        </div>
      </div>
    </Section>
  );
}
