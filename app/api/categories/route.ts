import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json([]);

  try {
    const sb = createClient(url, key);
    const { data, error } = await sb
      .from("categories")
      .select("id, slug, name, icon, description, sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error) return NextResponse.json([]);
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}
