import Link from "next/link";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";
import { AnimateIn } from "@/components/motion/animate-in";

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export function CtaBand({ lang, dict }: Props) {
  return (
    <section
      className="relative overflow-hidden bg-deep"
      style={{
        backgroundImage:
          "radial-gradient(circle at 70% 50%, rgba(46,124,168,0.25) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(232,179,60,0.08) 0%, transparent 50%)",
      }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
        <AnimateIn className="max-w-xl">
          <p className="font-mono text-[11px] tracking-widest text-signal uppercase mb-4">
            {lang === "pt" ? "COTAÇÃO" : "QUOTE"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">
            {dict.quoteBand.heading}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">{dict.quoteBand.body}</p>
        </AnimateIn>
        <AnimateIn delay={0.15} from="right" className="shrink-0">
          <Link
            href={`/${lang}/quote`}
            className="inline-flex items-center gap-2 rounded-lg bg-signal text-ink px-8 py-4 text-base font-semibold hover:bg-signal/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal shadow-lg shadow-signal/20"
          >
            {dict.quoteBand.button}
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </AnimateIn>
      </div>
    </section>
  );
}
