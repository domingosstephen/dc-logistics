"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { normaliseTrackingCode } from "@/lib/tracking-code";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  lang: Locale;
  dict: Dictionary;
  /** If true, shows the "paste up to 20" helper and parses multi-line input */
  multi?: boolean;
  /** If true, renders with transparent bg for use on dark hero */
  heroVariant?: boolean;
}

export function TrackingSearch({ lang, dict, multi = false, heroVariant = false }: Props) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!multi) {
      const code = normaliseTrackingCode(value.trim());
      if (code) {
        router.push(`/${lang}/track/${encodeURIComponent(code)}`);
      }
      return;
    }
    // Multi: parse up to 20 codes, comma/space/newline separated
    const codes = value
      .split(/[\s,\n]+/)
      .map((s) => normaliseTrackingCode(s.trim()))
      .filter(Boolean)
      .slice(0, 20);
    if (codes.length > 0) {
      router.push(`/${lang}/track?codes=${encodeURIComponent(codes.join(","))}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={heroVariant ? "" : "bg-surface rounded-lg border border-border p-6 md:p-8 shadow-sm"}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {multi ? (
          <textarea
            rows={4}
            placeholder={dict.tracking.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-ink placeholder:text-steel resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={dict.tracking.fieldLabel}
          />
        ) : (
          <Input
            type="text"
            placeholder={dict.tracking.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 h-11 font-mono"
            aria-label={dict.tracking.fieldLabel}
          />
        )}
        <Button
          type="submit"
          className="h-11 px-8 bg-marine text-white hover:bg-marine/90 focus-visible:ring-marine"
        >
          {dict.tracking.button}
        </Button>
      </div>
      {multi && (
        <p className="mt-2 text-xs text-steel">{dict.tracking.multiHelper}</p>
      )}
    </form>
  );
}
