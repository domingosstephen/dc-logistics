"use client";

import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  lang: Locale;
  dict: Dictionary;
}

const faqsByLang: Record<Locale, { q: string; a: string }[]> = {
  it: [
    { q: "Quali documenti servono per il trasporto del mio pet?", a: "Servono il microchip, le vaccinazioni aggiornate (inclusa l'antirabbica), il certificato sanitario e il passaporto EU per animali. Ci occupiamo noi di tutto il processo documentale." },
    { q: "Come posso tracciare il viaggio del mio animale?", a: "Riceverai un codice di tracciamento unico. Inseriscilo nella pagina 'Traccia il tuo Pet' per vedere aggiornamenti in tempo reale." },
    { q: "Il mio pet viaggia da solo?", a: "Mai. Un operatore esperto e dedicato accompagna il tuo pet durante tutto il viaggio." },
    { q: "Quanto tempo dura il viaggio?", a: "Dipende dalla rotta. I viaggi all'interno dell'Europa durano generalmente da 1 a 3 giorni." },
  ],
  en: [
    { q: "What documents are needed for my pet's transport?", a: "You need a microchip, up-to-date vaccinations (including rabies), a health certificate, and an EU pet passport. We handle the entire documentation process." },
    { q: "How can I track my pet's journey?", a: "You'll receive a unique tracking code. Enter it on the 'Track Your Pet' page for real-time updates." },
    { q: "Does my pet travel alone?", a: "Never. A dedicated, experienced handler accompanies your pet throughout the entire journey." },
    { q: "How long does the journey take?", a: "It depends on the route. Journeys within Europe typically take 1 to 3 days." },
  ],
  de: [
    { q: "Welche Dokumente werden fur den Transport meines Tieres benotigt?", a: "Sie benotigen einen Mikrochip, aktuelle Impfungen (einschliesslich Tollwut), ein Gesundheitszeugnis und einen EU-Heimtierausweis. Wir kummern uns um den gesamten Dokumentationsprozess." },
    { q: "Wie kann ich die Reise meines Tieres verfolgen?", a: "Sie erhalten einen einzigartigen Tracking-Code. Geben Sie ihn auf der Seite 'Tier verfolgen' ein fur Echtzeit-Updates." },
    { q: "Reist mein Tier allein?", a: "Niemals. Ein engagierter, erfahrener Betreuer begleitet Ihr Tier wahrend der gesamten Reise." },
    { q: "Wie lange dauert die Reise?", a: "Das hangt von der Route ab. Reisen innerhalb Europas dauern in der Regel 1 bis 3 Tage." },
  ],
  es: [
    { q: "Que documentos se necesitan para el transporte de mi mascota?", a: "Se necesita un microchip, vacunas actualizadas (incluida la rabia), un certificado sanitario y un pasaporte EU para animales. Nos encargamos de todo el proceso documental." },
    { q: "Como puedo rastrear el viaje de mi mascota?", a: "Recibiras un codigo de rastreo unico. Ingresalo en la pagina 'Rastrea tu mascota' para actualizaciones en tiempo real." },
    { q: "Mi mascota viaja sola?", a: "Nunca. Un operador experto y dedicado acompana a tu mascota durante todo el viaje." },
    { q: "Cuanto tiempo dura el viaje?", a: "Depende de la ruta. Los viajes dentro de Europa duran generalmente de 1 a 3 dias." },
  ],
  tr: [
    { q: "Evcil hayvanımın taşınması için hangi belgeler gerekli?", a: "Mikro çip, güncel aşılar (kuduz dahil), sağlık sertifikası ve AB evcil hayvan pasaportu gereklidir. Tüm belgeleme sürecini biz hallederiz." },
    { q: "Evcil hayvanımın yolculuğunu nasıl takip edebilirim?", a: "Benzersiz bir takip kodu alacaksınız. Gerçek zamanlı güncellemeler için 'Evcil Hayvanınızı Takip Edin' sayfasına girin." },
    { q: "Evcil hayvanım yalnız mı yolculuk eder?", a: "Asla. Deneyimli ve özel bir bakıcı, evcil hayvanınıza yolculuk boyunca eşlik eder." },
    { q: "Yolculuk ne kadar sürer?", a: "Güzergaha bağlıdır. Avrupa içi yolculuklar genellikle 1 ila 3 gün sürer." },
  ],
};

const ctaLabels: Record<Locale, string> = {
  it: "Vedi tutte le FAQ",
  en: "See all FAQs",
  de: "Alle FAQ ansehen",
  es: "Ver todas las FAQ",
  tr: "Tüm SSS'leri gör",
};

export function FaqPreview({ lang, dict }: Props) {
  const faqs = faqsByLang[lang];

  return (
    <Section className="bg-mist">
      <SectionHeader title={dict.faq.title} />
      <div className="max-w-2xl mx-auto">
        <Accordion className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} className="bg-paper rounded-xl border-none px-6">
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
          <Link href={`/${lang}/faq`} className="text-pine font-medium hover:text-pine-deep transition-colors">
            {ctaLabels[lang]} &rarr;
          </Link>
        </div>
      </div>
    </Section>
  );
}
