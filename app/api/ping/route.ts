import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Called by Vercel Cron daily to keep Supabase DB active (avoid free tier pausing)
export async function GET() {
  const { error } = await supabaseAdmin.from("products").select("id").limit(1);
  if (error) return NextResponse.json({ ok: false, error: error.message });
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}
