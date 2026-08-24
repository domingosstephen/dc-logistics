"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "dcbr_recent_codes";
const MAX_CODES = 10;

export function useSavedCodes() {
  function load(): string[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  }

  function save(code: string) {
    const codes = load().filter((c) => c !== code);
    codes.unshift(code);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes.slice(0, MAX_CODES)));
  }

  function remove(code: string) {
    const codes = load().filter((c) => c !== code);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { load, save, remove, clear };
}

interface SavedNumbersProps {
  lang?: string;
}

export function SavedNumbers({ lang = "pt" }: SavedNumbersProps) {
  const [codes, setCodes] = useState<string[]>([]);
  const { load, remove, clear } = useSavedCodes();

  useEffect(() => {
    setCodes(load());
  }, []);

  if (codes.length === 0) return null;

  const labels = {
    pt: {
      heading: "Rastreios recentes",
      clear: "Limpar",
      remove: "Remover",
    },
    en: {
      heading: "Recent shipments",
      clear: "Clear all",
      remove: "Remove",
    },
  }[lang === "en" ? "en" : "pt"];

  function handleRemove(code: string) {
    remove(code);
    setCodes(load());
  }

  function handleClear() {
    clear();
    setCodes([]);
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] tracking-widest text-steel uppercase">
          {labels.heading}
        </span>
        <button
          onClick={handleClear}
          className="text-xs text-steel hover:text-ink transition-colors"
        >
          {labels.clear}
        </button>
      </div>
      <ul className="space-y-1">
        {codes.map((code) => (
          <li key={code} className="flex items-center justify-between gap-3 py-1">
            <Link
              href={`/${lang}/track/${code}`}
              className="font-mono text-sm text-marine hover:underline"
            >
              {code}
            </Link>
            <button
              onClick={() => handleRemove(code)}
              className="text-[11px] text-steel hover:text-destructive transition-colors"
              aria-label={labels.remove}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
