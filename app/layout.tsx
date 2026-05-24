import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VHF Decants — Belén · Catamarca",
  description:
    "VHF Decants. Ropa, calzado, bazar, hogar, accesorios y tecnología. Envíos a todo el país.",
  keywords: [
    "VHF Decants",
    "tienda Belén",
    "Catamarca",
    "tienda online Argentina",
  ],
  openGraph: {
    title: "VHF Decants — Belén · Catamarca",
    description: "Productos seleccionados. Envíos a todo el país.",
    type: "website",
    locale: "es_AR",
    siteName: "VHF Decants",
  },
  twitter: {
    card: "summary_large_image",
    title: "VHF Decants",
    description: "Productos seleccionados. Envíos a todo el país.",
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
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink-950 text-bone antialiased relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
