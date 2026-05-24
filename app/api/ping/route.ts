import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/publicSupabase";

export const dynamic = "force-dynamic";

// Cron diario de Vercel → mantiene Supabase activo (evita auto-pause).
// Hace un SELECT trivial usando el anon key (no necesita service role).
export async function GET() {
  try {
    const sb = createPublicClient();
    const { error } = await sb.from("products").select("id").limit(1);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message });
    }
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
