import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";

interface Props { params: Promise<{ lang: string }> }

export default async function ProhibitedItemsPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  return (
    <main className="mx-auto max-w-[800px] px-5 md:px-8 py-18 md:py-24">
      <h1 className="font-display text-4xl font-semibold text-deep mb-8">{dict.legal.prohibitedH1}</h1>
      <p className="text-steel">{dict.legal.placeholder}</p>
    </main>
  );
}
