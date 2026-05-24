import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VHF Decants — Atelier de Perfumería de Lujo",
  description:
    "Decants 100% originales de los mejores perfumes nicho y designer del mundo. Fraccionados desde el frasco original. Envíos a toda Argentina.",
  keywords: [
    "decants",
    "perfumes nicho",
    "Tom Ford",
    "Baccarat Rouge",
    "Maison Francis Kurkdjian",
    "perfumes Argentina",
    "decants originales",
  ],
  authors: [{ name: "VHF Decants" }],
  openGraph: {
    title: "VHF Decants — Atelier de Perfumería de Lujo",
    description:
      "Probá los perfumes más codiciados del mundo desde 5 ml. 100% originales, fraccionados a mano.",
    type: "website",
    locale: "es_AR",
    siteName: "VHF Decants",
  },
  twitter: {
    card: "summary_large_image",
    title: "VHF Decants — Atelier de Perfumería de Lujo",
    description:
      "Probá los perfumes más codiciados del mundo desde 5 ml. 100% originales.",
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
        {/* Monograma de fondo, ultra-sutil */}
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
