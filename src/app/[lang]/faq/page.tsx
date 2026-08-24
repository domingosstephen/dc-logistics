import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";

interface Props {
  params: Promise<{ lang: string }>;
}

const FAQ_KEYS = [
  ["q1", "a1"], ["q2", "a2"], ["q3", "a3"], ["q4", "a4"],
  ["q5", "a5"], ["q6", "a6"], ["q7", "a7"], ["q8", "a8"],
] as const;

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="mx-auto max-w-[1200px] px-5 md:px-8 py-18 md:py-24">
      <h1 className="font-display text-4xl font-semibold text-deep mb-10">
        {dict.faq.h1}
      </h1>
      <div className="border-t-2 border-t-deep max-w-2xl">
        {FAQ_KEYS.map(([qKey, aKey]) => (
          <details key={qKey} className="group border-b border-border py-5">
            <summary className="flex justify-between items-start gap-4 cursor-pointer list-none text-ink font-medium">
              {dict.faq[qKey]}
              <svg
                className="w-4 h-4 shrink-0 text-steel mt-0.5 group-open:rotate-180 transition-transform"
                fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" d="M4 6l4 4 4-4" />
              </svg>
            </summary>
            <p className="mt-3 text-steel text-sm leading-relaxed">{dict.faq[aKey]}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
