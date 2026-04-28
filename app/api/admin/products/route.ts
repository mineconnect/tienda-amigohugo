import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json([
    {
      id: "test-1",
      name: "Producto de Prueba (Bypass)",
      description: "Si ves esto, el despliegue funciona",
      price: 1000,
      category: "Test",
      in_stock: true
    }
  ]);
}

export async function POST(req: Request) {
  return NextResponse.json({ error: "Modo mantenimiento" }, { status: 503 });
}
