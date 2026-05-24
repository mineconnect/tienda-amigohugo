import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type ProductInput = Partial<{
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  category_id: string | null;
  size: string | null;
  color: string | null;
  stock_qty: number | string;
  in_stock: boolean;
  featured: boolean;
  sort_order: number | string;
}>;

function sanitize(body: ProductInput) {
  const out: Record<string, unknown> = {};
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) return null;
    out.name = body.name.trim();
  }
  if (body.description !== undefined) {
    out.description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;
  }
  if (body.price !== undefined) {
    const n = typeof body.price === "string" ? parseFloat(body.price) : body.price;
    if (!isFinite(n as number) || (n as number) < 0) return null;
    out.price = n;
  }
  if (body.image_url !== undefined) {
    out.image_url =
      typeof body.image_url === "string" && body.image_url.trim()
        ? body.image_url.trim()
        : null;
  }
  if (body.category_id !== undefined) {
    out.category_id =
      typeof body.category_id === "string" && body.category_id ? body.category_id : null;
  }
  if (body.size !== undefined) {
    out.size = typeof body.size === "string" && body.size.trim() ? body.size.trim() : null;
  }
  if (body.color !== undefined) {
    out.color =
      typeof body.color === "string" && body.color.trim() ? body.color.trim() : null;
  }
  if (body.stock_qty !== undefined) {
    const n =
      typeof body.stock_qty === "string"
        ? parseInt(body.stock_qty, 10)
        : body.stock_qty;
    out.stock_qty = typeof n === "number" && isFinite(n) ? Math.max(0, n) : 0;
  }
  if (body.in_stock !== undefined) out.in_stock = !!body.in_stock;
  if (body.featured !== undefined) out.featured = !!body.featured;
  if (body.sort_order !== undefined) {
    const n =
      typeof body.sort_order === "string"
        ? parseInt(body.sort_order, 10)
        : body.sort_order;
    out.sort_order = typeof n === "number" && isFinite(n) ? n : 0;
  }
  return out;
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as ProductInput;
    const data = sanitize(body);
    if (!data) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from("products")
      .update(data)
      .eq("id", params.id)
      .select("*, category:categories(id, slug, name)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
