import Link from "next/link";
import { TrackingSearch } from "@/components/tracking/tracking-search";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export function HeroSection({ lang, dict }: Props) {
  return (
    <section className="bg-mist border-b border-border">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-24 md:py-32">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-deep leading-tight tracking-tight">
            {dict.hero.headline}
          </h1>
          <p className="mt-6 text-base md:text-lg text-steel leading-relaxed max-w-xl">
            {dict.hero.subline}
          </p>

          {/* Tracking input — the primary element */}
          <div className="mt-10">
            <TrackingSearch lang={lang} dict={dict} />
          </div>

          <div className="mt-4">
            <Link
              href={`/${lang}/quote`}
              className="text-sm text-marine hover:underline"
            >
              {dict.hero.quoteLink} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
