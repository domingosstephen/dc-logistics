import Link from "next/link";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();
  const links = dict.footer.links;

  return (
    <footer className="bg-deep text-white/70 mt-auto">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1 — Business identity */}
          <div>
            <p className="font-mono text-[11px] tracking-widest text-white/40 uppercase mb-3">
              {dict.footer.legalCol}
            </p>
            <p className="font-display text-lg font-semibold text-white mb-3">
              DC Logistics Brasil
            </p>
            <address className="not-italic text-sm text-white/50 leading-relaxed space-y-0.5">
              <p>DC Logistics Brasil Ltda.</p>
              <p>Rua Cincinato Braga, 340, Sala 162</p>
              <p>Bela Vista — São Paulo, SP</p>
              <p>CEP 01333-010</p>
              <p className="mt-1">CNPJ 74.182.593/0001-90</p>
            </address>
          </div>

          {/* Column 2 — Contact */}
          <div>
            <p className="font-mono text-[11px] tracking-widest text-white/40 uppercase mb-3">
              {dict.footer.contactCol}
            </p>
            <address className="not-italic text-sm text-white/50 leading-relaxed space-y-1">
              <p>
                <a
                  href="mailto:info@dclogisticsbrasil.com.br"
                  className="hover:text-white transition-colors"
                >
                  info@dclogisticsbrasil.com.br
                </a>
              </p>
              <p>
                <a
                  href="https://wa.me/5511952701046"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +55 (11) 9 5270-1046
                </a>
              </p>
              <p>Seg–Sex, 9h–18h (BRT)</p>
            </address>
          </div>

          {/* Column 3 — Links */}
          <div>
            <p className="font-mono text-[11px] tracking-widest text-white/40 uppercase mb-3">
              {dict.footer.linksCol}
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { href: `/${lang}/services`,          label: links.services },
                { href: `/${lang}/track`,             label: links.track },
                { href: `/${lang}/quote`,             label: links.quote },
                { href: `/${lang}/contact`,           label: links.contact },
                { href: `/${lang}/faq`,               label: links.faq },
                { href: `/${lang}/terms`,             label: links.terms },
                { href: `/${lang}/privacy`,           label: links.privacy },
                { href: `/${lang}/prohibited-items`,  label: links.prohibited },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <p className="text-xs text-white/30">
            {dict.footer.copyright.replace("{year}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
