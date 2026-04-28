import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const INITIAL_PRODUCTS = [
  {
    name: "Tom Ford Oud Wood",
    description: "Decant premium 5ml. Madera de oud suave y especiada con notas de madera de rosa y vetiver.",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    category: "Fragancias",
    in_stock: true,
    featured: true,
    size: "5ml",
    notes: ["Oud", "Vetiver", "Madera de Rosa"]
  },
  {
    name: "Baccarat Rouge 540",
    description: "Decant premium 10ml. Jazmín, azafrán, cedro amaderado.",
    price: 28000,
    image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    category: "Fragancias",
    in_stock: true,
    featured: true,
    size: "10ml",
    notes: ["Jazmín", "Azafrán", "Cedro"]
  },
  {
    name: "Creed Aventus",
    description: "Decant premium 5ml. La fragancia masculina más icónica.",
    price: 18000,
    image_url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
    category: "Fragancias",
    in_stock: true,
    featured: true,
    size: "5ml",
    notes: ["Piña", "Abedul", "Almizcle"]
  },
  {
    name: "Dior Sauvage Elixir",
    description: "Decant premium 10ml. Concentración extrema de Sauvage.",
    price: 22000,
    image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    category: "Fragancias",
    in_stock: true,
    featured: true,
    size: "10ml",
    notes: ["Lavanda", "Regaliz", "Canela"]
  }
];

export async function POST() {
  try {
    // 1. Check if table exists/is accessible
    const { count, error: countError } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return NextResponse.json({ 
        error: "La tabla 'products' no parece estar configurada. Por favor, asegúrate de haber ejecutado el script SQL en Supabase.",
        details: countError.message
      }, { status: 500 });
    }

    if (count && count > 0) {
       return NextResponse.json({ error: "Ya existen productos en la base de datos. Borra los actuales si quieres re-sembrar." }, { status: 400 });
    }

    // 2. Insert initial products
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(INITIAL_PRODUCTS)
      .select();

    if (error) {
      console.error("Seed error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Productos iniciales cargados con éxito", data });
  } catch (err) {
    console.error("Exception in seed:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
