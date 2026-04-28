import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lexkcitlapztnqgacvvn.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    // Si falla Supabase (ej. por falta de variables de entorno correctas), usar un fallback manual
    // para asegurar que el admin pueda entrar con sus credenciales maestras.
    if (email !== "admin@vhfdecants.com" || password !== "Hugo123VHF") {
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
