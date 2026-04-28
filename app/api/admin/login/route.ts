import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const validEmail = process.env.ADMIN_EMAIL || "admin@vhfdecants.com";
  const validPassword = process.env.ADMIN_PASSWORD || "Hugo123VHF";

  if (email !== validEmail || password !== validPassword) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
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
