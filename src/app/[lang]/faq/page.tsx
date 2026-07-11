import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import { Section, SectionHeader } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqAccordion } from "@/components/faq-accordion";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const faqGroups = getFaqGroups(lang as Locale);

  return (
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">{dict.faq.title}</h1>
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
      <CtaBand lang={lang as Locale} dict={dict} />
    </>
  );
}

function getFaqGroups(lang: Locale) {
  if (lang === "en") return [
    { category: "Documents & Requirements", faqs: [
      { q: "What documents are needed?", a: "Microchip, up-to-date vaccinations (including rabies), health certificate, and EU pet passport. We handle all documentation." },
      { q: "Does my pet need an EU passport?", a: "Yes, for travel between EU countries. We help obtain one as part of our service." },
    ]},
    { category: "The Journey", faqs: [
      { q: "How does my pet travel?", a: "In a comfortable, ventilated crate with a dedicated handler. Rest stops every 4 hours. Temperature controlled throughout." },
      { q: "How long does it take?", a: "Typically 1-3 days within Europe, depending on the route." },
    ]},
    { category: "Tracking", faqs: [
      { q: "How do I track my pet?", a: "You'll get a unique code (e.g. IT-7H4K-2Q). Enter it on the tracking page for real-time updates." },
    ]},
  ];
  if (lang === "de") return [
    { category: "Dokumente & Anforderungen", faqs: [
      { q: "Welche Dokumente werden benotigt?", a: "Mikrochip, aktuelle Impfungen, Gesundheitszeugnis und EU-Heimtierausweis." },
    ]},
    { category: "Die Reise", faqs: [
      { q: "Wie reist mein Tier?", a: "In einer komfortablen Transportbox mit erfahrenem Betreuer. Alle 4 Stunden Pausen." },
    ]},
    { category: "Verfolgung", faqs: [
      { q: "Wie verfolge ich mein Tier?", a: "Sie erhalten einen Tracking-Code. Geben Sie ihn auf der Tracking-Seite ein." },
    ]},
  ];
  if (lang === "es") return [
    { category: "Documentos y Requisitos", faqs: [
      { q: "Que documentos se necesitan?", a: "Microchip, vacunas, certificado sanitario y pasaporte EU para animales." },
    ]},
    { category: "El Viaje", faqs: [
      { q: "Como viaja mi mascota?", a: "En transportin comodo con operador dedicado. Paradas cada 4 horas." },
    ]},
    { category: "Rastreo", faqs: [
      { q: "Como rastreo a mi mascota?", a: "Recibiras un codigo unico para seguir el viaje en tiempo real." },
    ]},
  ];
  if (lang === "tr") return [
    { category: "Belgeler ve Gereksinimler", faqs: [
      { q: "Hangi belgeler gerekli?", a: "Mikro çip, güncel aşılar (kuduz dahil), sağlık sertifikası ve AB evcil hayvan pasaportu. Tüm belgeleri biz hallederiz." },
      { q: "Evcil hayvanımın AB pasaportu olması şart mı?", a: "Evet, AB ülkeleri arasında seyahat için gereklidir. Hizmetimizin bir parçası olarak edinmenize yardım ederiz." },
    ]},
    { category: "Yolculuk", faqs: [
      { q: "Evcil hayvanım nasıl yolculuk eder?", a: "Özel bakıcı eşliğinde, havalandırmalı ve konforlu bir kafeste. Her 4 saatte bir dinlenme molası verilir, ısı kontrolü sürekli sağlanır." },
      { q: "Yolculuk ne kadar sürer?", a: "Güzergaha göre değişmekle birlikte, Avrupa içinde genellikle 1-3 gün sürmektedir." },
    ]},
    { category: "Takip", faqs: [
      { q: "Evcil hayvanımı nasıl takip ederim?", a: "Size benzersiz bir kod verilir (ör. IT-7H4K-2Q). Gerçek zamanlı güncellemeler için bu kodu takip sayfasına girin." },
    ]},
  ];
  return [
    { category: "Documenti & Requisiti", faqs: [
      { q: "Quali documenti servono?", a: "Microchip, vaccinazioni aggiornate, certificato sanitario e passaporto EU per animali." },
      { q: "Serve il passaporto EU?", a: "Si, per viaggiare tra paesi EU. Lo aiutiamo a ottenerlo." },
    ]},
    { category: "Il Viaggio", faqs: [
      { q: "Come viaggia il mio pet?", a: "In un trasportino confortevole con operatore dedicato. Soste ogni 4 ore." },
      { q: "Quanto dura il viaggio?", a: "Da 1 a 3 giorni in Europa, dipende dalla rotta." },
    ]},
    { category: "Tracciamento", faqs: [
      { q: "Come traccio il mio pet?", a: "Riceverai un codice unico (es. IT-7H4K-2Q). Inseriscilo nella pagina di tracciamento." },
    ]},
  ];
}
