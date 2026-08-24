import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="mx-auto max-w-[1200px] px-5 md:px-8 py-18 md:py-24">
      <h1 className="font-display text-4xl font-semibold text-deep mb-6">
        {dict.servicesPage.h1}
      </h1>
      <p className="text-steel mb-12 max-w-2xl">
        {lang === "pt" ? dict.servicesPage.introPt : dict.servicesPage.introEn}
      </p>

      {/* Service blocks — [CLIENT TO CONFIRM SERVICE LIST] */}
      <div className="border-t-2 border-t-deep">
        <p className="py-8 text-steel italic">{dict.services.cards}</p>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <p className="text-sm text-steel">{dict.servicesPage.closing}</p>
      </div>
    </main>
  );
}
