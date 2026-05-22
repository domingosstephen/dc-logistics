"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TrackingSearch() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) {
      router.push(`/track/${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="bg-paper rounded-2xl shadow-[var(--shadow-soft)] p-8 md:p-10">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Inserisci il codice di tracciamento"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-12 rounded-xl border-pine/20 bg-mist text-ink placeholder:text-ink/40 focus:border-pine focus:ring-pine"
          />
          <p className="text-xs text-ink/40 mt-2 ml-1">
            Es. IT-7H4K-2Q
          </p>
        </div>
        <Button
          type="submit"
          className="h-12 px-8 rounded-xl bg-pine text-paper hover:bg-pine-deep font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
            <circle cx="7" cy="7" r="5" />
            <path strokeLinecap="round" d="M11 11l3 3" />
          </svg>
          Cerca
        </Button>
      </form>
    </div>
  );
}
