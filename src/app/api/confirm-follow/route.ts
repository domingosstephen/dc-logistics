import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/pt?confirm=error", req.url));
  }

  const supabase = createServerClient();
  const { error } = await supabase.rpc("confirm_follower", { p_token: token });

  if (error) {
    return NextResponse.redirect(new URL("/pt?confirm=error", req.url));
  }

  return NextResponse.redirect(new URL("/pt?confirm=ok", req.url));
}
