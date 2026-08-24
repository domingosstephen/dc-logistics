"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { locales, localeNames } from "@/i18n/config";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
  isAuthenticated?: boolean;
}

export function Header({ lang, dict, isAuthenticated = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const getLocalePath = (targetLang: string) => {
    const segments = pathname.split("/");
    segments[1] = targetLang;
    return segments.join("/");
  };

  const navLinks = [
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/track`, label: dict.nav.track },
    { href: `/${lang}/quote`, label: dict.nav.quote },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="flex h-14 items-center justify-between gap-6">
          {/* Wordmark */}
          <Link
            href={`/${lang}`}
            className="font-display text-xl font-semibold text-deep shrink-0 tracking-tight"
          >
            DC Logistics Brasil
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-steel hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language toggle */}
            <div className="flex items-center gap-1 text-xs font-mono">
              {locales.map((locale, i) => (
                <span key={locale} className="flex items-center gap-1">
                  {i > 0 && <span className="text-steel/40">/</span>}
                  <Link
                    href={getLocalePath(locale)}
                    className={
                      locale === lang
                        ? "text-ink font-medium"
                        : "text-steel hover:text-ink transition-colors"
                    }
                  >
                    {locale.toUpperCase()}
                  </Link>
                </span>
              ))}
            </div>

            <Link
              href={isAuthenticated ? `/${lang}/dashboard` : `/admin/login`}
              className="text-sm text-marine hover:text-marine/80 transition-colors"
            >
              {isAuthenticated ? dict.nav.dashboard : dict.nav.signIn}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-steel hover:text-ink"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
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
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <nav className="mx-auto max-w-[1200px] px-5 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm text-steel hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-border flex items-center gap-4">
              <div className="flex items-center gap-1 text-xs font-mono">
                {locales.map((locale, i) => (
                  <span key={locale} className="flex items-center gap-1">
                    {i > 0 && <span className="text-steel/40">/</span>}
                    <Link
                      href={getLocalePath(locale)}
                      onClick={() => setMobileOpen(false)}
                      className={locale === lang ? "text-ink font-medium" : "text-steel"}
                    >
                      {locale.toUpperCase()}
                    </Link>
                  </span>
                ))}
              </div>
              <Link
                href={isAuthenticated ? `/${lang}/dashboard` : `/admin/login`}
                className="text-sm text-marine"
                onClick={() => setMobileOpen(false)}
              >
                {isAuthenticated ? dict.nav.dashboard : dict.nav.signIn}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
