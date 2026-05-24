import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

// Listado para el panel (incluye sin stock e inactivos)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, category:categories(id, slug, name)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Exception in GET products:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

type ProductInput = {
  name?: string;
  description?: string | null;
  price?: number | string;
  image_url?: string | null;
  category_id?: string | null;
  size?: string | null;
  color?: string | null;
  stock_qty?: number | string;
  in_stock?: boolean;
  featured?: boolean;
  sort_order?: number | string;
};

function sanitize(body: ProductInput) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description =
    typeof body.description === "string" && body.description.trim()
      ? body.description.trim()
      : null;
  const priceNum =
    typeof body.price === "string" ? parseFloat(body.price) : body.price;
  const price = typeof priceNum === "number" && isFinite(priceNum) ? priceNum : NaN;
  const image_url =
    typeof body.image_url === "string" && body.image_url.trim()
      ? body.image_url.trim()
      : null;
  const category_id =
    typeof body.category_id === "string" && body.category_id ? body.category_id : null;
  const size =
    typeof body.size === "string" && body.size.trim() ? body.size.trim() : null;
  const color =
    typeof body.color === "string" && body.color.trim() ? body.color.trim() : null;
  const stockNum =
    typeof body.stock_qty === "string"
      ? parseInt(body.stock_qty, 10)
      : body.stock_qty;
  const stock_qty =
    typeof stockNum === "number" && isFinite(stockNum) ? Math.max(0, stockNum) : 0;
  const in_stock = body.in_stock === undefined ? true : !!body.in_stock;
  const featured = body.featured === undefined ? false : !!body.featured;
  const sortNum =
    typeof body.sort_order === "string"
      ? parseInt(body.sort_order, 10)
      : body.sort_order;
  const sort_order =
    typeof sortNum === "number" && isFinite(sortNum) ? sortNum : 0;

  return {
    name,
    description,
    price,
    image_url,
    category_id,
    size,
    color,
    stock_qty,
    in_stock,
    featured,
    sort_order,
  };
}

// Crear producto
export async function POST(req: Request) {
  try {
    const body: ProductInput = await req.json();
    const data = sanitize(body);

    if (!data.name || data.name.length > 200) {
      return NextResponse.json(
        { error: "El nombre es obligatorio y debe tener menos de 200 caracteres" },
        { status: 400 }
      );
    }
    if (!isFinite(data.price) || data.price < 0) {
      return NextResponse.json(
        { error: "El precio es obligatorio y debe ser un número válido" },
        { status: 400 }
      );
    }

    const { data: created, error } = await supabaseAdmin
      .from("products")
      .insert([data])
      .select("*, category:categories(id, slug, name)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
