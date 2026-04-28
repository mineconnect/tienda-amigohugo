import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = (password || "").trim();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lexkcitlapztnqgacvvn.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: cleanPassword,
  });

  if (error || !data.user) {
    // Fallback maestro
    if (cleanEmail !== "admin@vhfdecants.com" || cleanPassword !== "Hugo123VHF") {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }
  }

  const token = await signAdminToken();
  const response = NextResponse.json({ ok: true });

  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });

  return response;
}
