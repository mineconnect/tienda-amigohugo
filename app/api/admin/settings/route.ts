import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const KEY_RE = /^[a-z0-9_]+$/;

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("key, value, updated_at")
    .order("key");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// Bulk upsert — recibe { settings: [{key, value}, ...] }
export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { settings?: { key?: unknown; value?: unknown }[] };
    if (!Array.isArray(body.settings)) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }

    const rows: { key: string; value: string | null }[] = [];
    for (const s of body.settings) {
      if (typeof s.key !== "string" || !KEY_RE.test(s.key) || s.key.length > 80) {
        return NextResponse.json(
          { error: `Key inválida: "${s.key}"` },
          { status: 400 }
        );
      }
      const value = s.value === null || s.value === undefined ? null : String(s.value);
      if (value && value.length > 5000) {
        return NextResponse.json(
          { error: `Value demasiado largo para ${s.key}` },
          { status: 400 }
        );
      }
      rows.push({ key: s.key, value });
    }

    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, count: rows.length });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
