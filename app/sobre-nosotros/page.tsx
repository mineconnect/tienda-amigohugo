import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { createPublicClient } from "@/lib/publicSupabase";
import type { Category } from "@/lib/supabase";

export const metadata = {
  title: "Sobre nosotros — VHF Decants",
  description: "VHF Decants — tienda en Belén, Catamarca.",
};

export const dynamic = "force-dynamic";

async function getCategories(): Promise<Category[]> {
  try {
    const sb = createPublicClient();
    const { data } = await sb
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    return (data as Category[]) || [];
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);

  return (
    <>
      <Navbar categories={categories} />
      <main className="pt-28 pb-24 px-4 sm:px-6 md:px-10 max-w-3xl mx-auto">
        <section className="py-16 sm:py-24 text-center">
          <p className="eyebrow justify-center mb-5">VHF Decants</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-bone leading-tight mb-6 text-balance">
            Belén, Catamarca.
          </h1>
          <p className="text-base sm:text-lg text-bone/75 leading-relaxed">
            Tienda online con envíos a todo el país. Productos seleccionados.
          </p>
        </section>

        <section className="py-12 text-center border-t border-gold-400/10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-bone mb-4">
            Hablemos
          </h2>
          <p className="text-bone/70 mb-8 max-w-md mx-auto">
            ¿Una consulta sobre un producto, un talle o un envío? Escribinos.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/#catalogo" className="btn-gold">
              Ver catálogo
            </Link>
            <a
              href={`https://wa.me/${settings.contact_whatsapp || "5493834789035"}`}
              target="_blank"
              rel="noopener"
              className="btn-outline"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer categories={categories} settings={settings} />
    </>
  );
}
