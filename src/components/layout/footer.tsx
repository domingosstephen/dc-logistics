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
              WayTrasporto
            </span>
            <p className="mt-4 text-sm text-paper/60 max-w-md leading-relaxed">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-paper mb-4">
              {lang === "it" ? "Navigazione" : lang === "de" ? "Navigation" : lang === "es" ? "Navegacion" : lang === "tr" ? "Gezinti" : "Navigation"}
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
              {lang === "it" ? "Contatti" : lang === "de" ? "Kontakt" : lang === "es" ? "Contacto" : lang === "tr" ? "İletişim" : "Contact"}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://wa.me/31684047232"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-paper/60 hover:text-honey transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  +31 6840 47232
                </a>
              </li>
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
            &copy; {new Date().getFullYear()} WayTrasporto.{" "}
            {lang === "it"
              ? "Tutti i diritti riservati."
              : lang === "de"
              ? "Alle Rechte vorbehalten."
              : lang === "es"
              ? "Todos los derechos reservados."
              : lang === "tr"
              ? "Tüm hakları saklıdır."
              : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
