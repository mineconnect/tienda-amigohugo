import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sanitizeCategoryInput, CategoryInput } from "./sanitize";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*, products:products(count)")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const normalized = (data || []).map(
    (c: { products?: { count: number }[] } & Record<string, unknown>) => ({
      ...c,
      product_count: c.products?.[0]?.count ?? 0,
    })
  );

  return NextResponse.json(normalized);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CategoryInput;
    const result = sanitizeCategoryInput(body);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { data: created, error } = await supabaseAdmin
      .from("categories")
      .insert([result.data])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
