import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import { QuoteForm } from "@/components/quote-form";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function QuotePage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="mx-auto max-w-[1200px] px-5 md:px-8 py-18 md:py-24">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-deep mb-3">
          {dict.quote.h1}
        </h1>
        <p className="text-steel mb-10">{dict.quote.intro}</p>
        <QuoteForm lang={lang as Locale} dict={dict} />
        <p className="mt-6 text-xs text-steel">{dict.quote.note}</p>
      </div>
    </main>
  );
}
