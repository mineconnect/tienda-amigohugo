import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const token = await signAdminToken();
  const response = NextResponse.json({ ok: true, debug: "Bypass active" });

  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });

  return response;
}
