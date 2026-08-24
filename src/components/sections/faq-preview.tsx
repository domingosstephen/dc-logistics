import Link from "next/link";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export function FaqPreview({ lang, dict }: Props) {
  // Show first 4 FAQ entries from the copy deck
  const faqKeys = ["q1", "q2", "q3", "q4"] as const;

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-24 md:py-32">
        <h2 className="font-display text-3xl font-semibold text-deep mb-10">
          {dict.faq.h1}
        </h2>

        <div className="border-t-2 border-t-deep">
          {faqKeys.map((key) => (
            <details key={key} className="group border-b border-border py-5">
              <summary className="flex justify-between items-start gap-4 cursor-pointer list-none text-ink font-medium">
                {dict.faq[key as keyof typeof dict.faq]}
                <svg
                  className="w-4 h-4 shrink-0 text-steel mt-0.5 group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 16 16"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" d="M4 6l4 4 4-4" />
                </svg>
              </summary>
              <p className="mt-3 text-steel text-sm leading-relaxed">
                {dict.faq[key.replace("q", "a") as keyof typeof dict.faq]}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-8">
          <Link href={`/${lang}/faq`} className="text-sm text-marine hover:underline">
            {lang === "pt" ? "Ver todas as perguntas" : "See all questions"} →
          </Link>
        </div>
      </div>
    </section>
  );
}
