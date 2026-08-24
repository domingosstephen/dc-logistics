import Link from "next/link";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export function CtaBand({ lang, dict }: Props) {
  return (
    <section className="bg-mist border-y border-border">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-20">
        <h2 className="font-display text-3xl font-semibold text-deep mb-3">
          {dict.quoteBand.heading}
        </h2>
        <p className="text-steel mb-8">{dict.quoteBand.body}</p>
        <Link
          href={`/${lang}/quote`}
          className="inline-flex items-center justify-center rounded-md bg-marine text-white px-6 py-2.5 text-sm font-medium hover:bg-marine/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {dict.quoteBand.button}
        </Link>
      </div>
    </section>
  );
}
