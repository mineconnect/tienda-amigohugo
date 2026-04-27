import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin/dashboard");
  const isAdminApi = pathname.startsWith("/api/admin/products");

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      if (isAdminApi) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/admin/products/:path*"],
};
