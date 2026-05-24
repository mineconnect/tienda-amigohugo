import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Cron diario de Vercel → mantiene Supabase activo (evita auto-pause).
// Hace un SELECT trivial usando el anon key (no necesita service role).
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { ok: false, error: "Supabase env vars missing" },
      { status: 503 }
    );
  }
  try {
    const sb = createClient(url, key);
    const { error } = await sb.from("products").select("id").limit(1);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message });
    }
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
