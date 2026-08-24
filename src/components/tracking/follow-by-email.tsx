"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FollowByEmailProps {
  trackingCode: string;
  lang: string;
}

export function FollowByEmail({ trackingCode, lang }: FollowByEmailProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "already" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracking_code: trackingCode, email }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      setStatus("error");
      return;
    }

    setStatus(data.already ? "already" : "ok");
  }

  const labels = {
    pt: {
      heading: "Receber atualizações por e-mail",
      placeholder: "seu@email.com",
      button: "Seguir envio",
      loading: "Cadastrando…",
      ok: "Verifique sua caixa de entrada para confirmar o cadastro.",
      already: "Este e-mail já está cadastrado para este envio.",
      error: "Erro ao cadastrar. Tente novamente.",
    },
    en: {
      heading: "Get email updates",
      placeholder: "your@email.com",
      button: "Follow shipment",
      loading: "Subscribing…",
      ok: "Check your inbox to confirm your subscription.",
      already: "This email is already subscribed to this shipment.",
      error: "Error subscribing. Please try again.",
    },
  }[lang === "en" ? "en" : "pt"];

  if (status === "ok" || status === "already") {
    return (
      <p className="text-sm text-steel">{labels[status]}</p>
    );
  }

  return (
    <div className="mt-6 border-t border-border pt-6">
      <p className="text-sm font-medium text-ink mb-3">{labels.heading}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={labels.placeholder}
          className="h-9 text-sm flex-1"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="h-9 px-4 text-sm bg-marine text-white hover:bg-marine/90 shrink-0"
        >
          {status === "loading" ? labels.loading : labels.button}
        </Button>
      </form>
      {status === "error" && (
        <p className="text-xs text-destructive mt-2">{labels.error}</p>
      )}
    </div>
  );
}
