import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VHF Decants — The Digital Sommelier",
  description: "Decants de perfumes de lujo. Descubrí las mejores fragancias del mundo.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background antialiased">
        {children}
      </body>
    </html>
  );
}
