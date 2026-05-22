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
    <>
      <section className="bg-pine-deep text-paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            {dict.quote.title}
          </h1>
          <p className="mt-4 text-lg text-paper/60 max-w-xl mx-auto">
            {dict.quote.subtitle}
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 -mt-8 mb-20">
        <QuoteForm dict={dict} />
      </div>
    </>
  );
}
