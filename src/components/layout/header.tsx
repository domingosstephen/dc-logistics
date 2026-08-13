"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const localeLabels: Record<string, string> = {
  it: "IT",
  en: "EN",
  de: "DE",
  es: "ES",
  tr: "TR",
};

const localeFlags: Record<string, string> = {
  it: "Italiano",
  en: "English",
  de: "Deutsch",
  es: "Espanol",
  tr: "Türkçe",
};

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
}

export function Header({ lang, dict }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Build localized path by swapping the locale prefix
  const getLocalePath = (targetLang: string) => {
    const segments = pathname.split("/");
    segments[1] = targetLang;
    return segments.join("/");
  };

  const navLinks = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/how-it-works`, label: dict.nav.howItWorks },
    { href: `/${lang}/coverage`, label: dict.nav.coverage },
    { href: `/${lang}/track`, label: dict.nav.track },
    { href: `/${lang}/faq`, label: dict.nav.faq },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/95 backdrop-blur-md border-b border-pine/10 shadow-sm"
          : "bg-paper/80 backdrop-blur-md border-b border-pine/10"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-semibold text-pine transition-colors group-hover:text-pine-deep">
              WayTrasporto
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-ink/70 hover:text-pine transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-honey after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}

            {/* WhatsApp */}
            <a
              href="https://wa.me/393508410749"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-pine hover:text-pine-deep transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-pine transition-colors px-2 py-1 rounded-lg hover:bg-pine/5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M1.5 8h13M8 1.5c-2 2-2 9 0 13M8 1.5c2 2 2 9 0 13" />
                </svg>
                {localeLabels[lang]}
                <svg className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M3 4.5l3 3 3-3" />
                </svg>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 bg-paper rounded-xl shadow-lg border border-pine/10 py-1 min-w-[140px] z-50"
                  >
                    {Object.entries(localeFlags).map(([code, label]) => (
                      <Link
                        key={code}
                        href={getLocalePath(code)}
                        onClick={() => setLangOpen(false)}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          code === lang
                            ? "text-pine font-medium bg-pine/5"
                            : "text-ink/60 hover:text-ink hover:bg-mist"
                        }`}
                      >
                        <span className="mr-2">{localeLabels[code]}</span>
                        {label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href={`/${lang}/quote`}
              className="inline-flex items-center justify-center rounded-full bg-pine px-5 py-2 text-sm font-medium text-paper hover:bg-pine-deep transition-all hover:shadow-md hover:-translate-y-[1px] active:translate-y-0"
            >
              {dict.nav.quote}
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-ink"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-paper border-b border-pine/10 overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-ink/70 hover:text-pine transition-colors py-2 block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* WhatsApp */}
              <a
                href="https://wa.me/393508410749"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-pine hover:text-pine-deep transition-colors py-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                +39 350 841 0749
              </a>

              {/* Mobile language switcher */}
              <div className="flex gap-2 py-2 border-t border-pine/5 mt-1 pt-3">
                {Object.entries(localeLabels).map(([code, label]) => (
                  <Link
                    key={code}
                    href={getLocalePath(code)}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      code === lang
                        ? "bg-pine text-paper"
                        : "bg-mist text-ink/60 hover:bg-pine/10"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <Link
                  href={`/${lang}/quote`}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-pine px-5 py-2.5 text-sm font-medium text-paper hover:bg-pine-deep transition-colors mt-2"
                >
                  {dict.nav.quote}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
