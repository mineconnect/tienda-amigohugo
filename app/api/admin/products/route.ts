import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

// GET all products (including out of stock) for admin
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json([]);
    }
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Exception in GET products:", err);
    return NextResponse.json([]);
  }
}

// POST create product
export async function POST(req: Request) {
  const body = await req.json();
  const { name, description, price, image_url, category, notes, size, in_stock } = body;

  if (!name || price === undefined) {
    return NextResponse.json({ error: "Nombre y precio son requeridos" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert([{ name, description, price, image_url, category, notes, size, in_stock: in_stock ?? true }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
