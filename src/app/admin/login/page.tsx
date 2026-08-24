"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciais inválidas. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-semibold text-white">
            DC Logistics Brasil
          </h1>
          <p className="text-white/40 text-xs font-mono tracking-widest uppercase mt-2">
            Admin
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-white/10 p-8">
          <h2 className="font-display text-xl font-semibold text-deep mb-6">
            Entrar
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm text-ink mb-1.5 block">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@dclogisticsbrasil.com"
                className="h-10"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm text-ink mb-1.5 block">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="h-10"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-marine text-white hover:bg-marine/90"
            >
              {loading ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
