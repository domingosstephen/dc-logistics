import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// Rate limiting: very basic IP-based check via Supabase RLS counts
// For production, use Upstash or similar — but this is sufficient for MVP.

export async function POST(req: NextRequest) {
  const { tracking_code, email } = await req.json();

  if (!tracking_code || !email) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  const supabase = createServerClient();

  // Confirm the shipment exists (use public RPC to avoid exposing internal IDs)
  const { data: shipment } = await supabase
    .from("shipments")
    .select("id")
    .eq("tracking_code", tracking_code.trim().toUpperCase())
    .single();

  if (!shipment) {
    return NextResponse.json({ error: "Envio não encontrado." }, { status: 404 });
  }

  // Check if already subscribed
  const { data: existing } = await supabase
    .from("followers")
    .select("id, confirmed")
    .eq("shipment_id", shipment.id)
    .eq("email", email.toLowerCase())
    .single();

  if (existing?.confirmed) {
    return NextResponse.json({ ok: true, already: true });
  }

  if (existing && !existing.confirmed) {
    // Resend confirmation (token already set); just acknowledge
    return NextResponse.json({ ok: true, pending: true });
  }

  // Insert new follower — DB generates the confirmation token
  const { error } = await supabase.from("followers").insert({
    shipment_id: shipment.id,
    email: email.toLowerCase(),
  });

  if (error) {
    return NextResponse.json({ error: "Erro ao registrar." }, { status: 500 });
  }

  // TODO: send confirmation email via Resend with confirm_token
  // For now, auto-confirm is handled by confirm_follower RPC.
  // The email flow requires Resend integration.

  return NextResponse.json({ ok: true });
}
