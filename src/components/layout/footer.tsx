import Link from "next/link";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  return (
    <footer className="bg-pine-deep text-paper/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-display text-2xl font-semibold text-paper">
              InfoAnimaleCarico
            </span>
            <p className="mt-4 text-sm text-paper/60 max-w-md leading-relaxed">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-paper mb-4">
              {lang === "it" ? "Navigazione" : lang === "de" ? "Navigation" : lang === "es" ? "Navegacion" : "Navigation"}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: `/${lang}/how-it-works`, label: dict.nav.howItWorks },
                { href: `/${lang}/coverage`, label: dict.nav.coverage },
                { href: `/${lang}/track`, label: dict.nav.track },
                { href: `/${lang}/quote`, label: dict.nav.quote },
                { href: `/${lang}/faq`, label: dict.nav.faq },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/60 hover:text-honey transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium text-paper mb-4">
              {lang === "it" ? "Legale" : lang === "de" ? "Rechtliches" : lang === "es" ? "Legal" : "Legal"}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={`/${lang}/privacy`}
                  className="text-sm text-paper/60 hover:text-honey transition-colors"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/faq`}
                  className="text-sm text-paper/60 hover:text-honey transition-colors"
                >
                  {dict.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-paper/10 text-center">
          <p className="text-xs text-paper/40">
            &copy; {new Date().getFullYear()} InfoAnimaleCarico.{" "}
            {lang === "it"
              ? "Tutti i diritti riservati."
              : lang === "de"
              ? "Alle Rechte vorbehalten."
              : lang === "es"
              ? "Todos los derechos reservados."
              : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
