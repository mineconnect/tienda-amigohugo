import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VHF — Importaciones de Belén · Productos seleccionados a mano",
  description:
    "Tienda de Víctor Hugo Figueroa. Ropa, calzado, bazar, hogar, accesorios y tecnología seleccionados a mano. Envíos a todo el país.",
  keywords: [
    "tienda Belén",
    "Catamarca",
    "tienda online Argentina",
    "ropa importada",
    "Víctor Hugo Figueroa",
    "VHF",
  ],
  authors: [{ name: "Víctor Hugo Figueroa" }],
  openGraph: {
    title: "VHF — Importaciones de Belén",
    description:
      "Productos seleccionados a mano por Víctor Hugo. Ropa, calzado, bazar, hogar.",
    type: "website",
    locale: "es_AR",
    siteName: "VHF",
  },
  twitter: {
    card: "summary_large_image",
    title: "VHF — Importaciones de Belén",
    description: "Productos seleccionados a mano. Envíos a todo el país.",
  },
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter+Tight:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink-950 text-bone antialiased relative overflow-x-hidden">
        <div className="fixed inset-0 z-[-1] flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display italic text-white opacity-[0.015] text-[28vw] leading-none">
            V
          </span>
        </div>
        {children}
      </body>
    </html>
  );
}
