import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/publicSupabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sb = createPublicClient();
    const { data, error } = await sb
      .from("products")
      .select("*, category:categories(id, slug, name)")
      .eq("in_stock", true)
      .order("sort_order", { ascending: true });
    if (error) return NextResponse.json([]);
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}
