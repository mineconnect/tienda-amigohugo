import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { signAdminToken } from "@/lib/auth";

function safeEqualString(a: string, b: string): boolean {
  // Iguala longitudes con padding para no filtrar la longitud de la real.
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  const len = Math.max(ab.length, bb.length, 1);
  const aPad = Buffer.alloc(len);
  const bPad = Buffer.alloc(len);
  ab.copy(aPad);
  bb.copy(bPad);
  const eq = timingSafeEqual(aPad, bPad);
  return eq && ab.length === bb.length;
}

export async function POST(req: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("ADMIN_EMAIL o ADMIN_PASSWORD no configuradas");
    return NextResponse.json(
      { error: "Configuración del servidor incompleta" },
      { status: 500 }
    );
  }

  const okEmail = safeEqualString(email, adminEmail.trim().toLowerCase());
  const okPassword = safeEqualString(password, adminPassword);

  if (!okEmail || !okPassword) {
    // Pequeño delay artificial para frenar fuerza bruta básica.
    await new Promise((r) => setTimeout(r, 250));
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
