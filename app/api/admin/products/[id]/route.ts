import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

// PUT update product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { name, description, price, image_url, category, notes, size, in_stock, featured } = body;

  const { data, error } = await supabaseAdmin
    .from("products")
    .update({ name, description, price, image_url, category, notes, size, in_stock, featured })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE product
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
