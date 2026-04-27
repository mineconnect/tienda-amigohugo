import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/lib/supabase";

async function getProducts(): Promise<Product[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("created_at", { ascending: false });
  return data || [];
}

export const revalidate = 60; // Revalida cada 60 segundos

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center pt-40 pb-24 px-6 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <p className="font-headline uppercase tracking-[0.4em] text-xs text-on-surface-variant mb-6">
            The Digital Sommelier
          </p>
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-on-background mb-6 leading-tight">
            VHF Decants
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-10">
            Decants de perfumes de lujo. Descubrí las mejores fragancias del mundo en porciones únicas.
          </p>
          <a
            href="#catalogo"
            className="inline-flex items-center gap-2 bg-primary text-on-primary-fixed font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-primary-dim transition-colors duration-300"
          >
            Ver Colección
            <span className="material-symbols-outlined text-base">arrow_downward</span>
          </a>
        </section>

        {/* Catalog */}
        <section id="catalogo" className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                Nuestra colección
              </p>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-background">
                Fragancias Disponibles
              </h2>
            </div>
            <p className="text-sm text-on-surface-variant">
              {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 text-on-surface-variant">
              <span className="material-symbols-outlined text-6xl mb-4 block opacity-30">inventory_2</span>
              <p className="text-sm uppercase tracking-widest">Catálogo en preparación</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>

        {/* WhatsApp CTA */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
          <div className="glass-card luminous-shadow rounded-2xl p-10 md:p-14 text-center border border-outline-variant/10">
            <p className="font-headline uppercase tracking-widest text-xs text-on-surface-variant mb-4">
              ¿Necesitás ayuda?
            </p>
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
              Hablá con el vendedor
            </h2>
            <p className="text-on-surface-variant mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Consultá disponibilidad, pedidos especiales o cualquier duda directamente por WhatsApp.
            </p>
            <a
              href="https://wa.me/5493834789035"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#1db954] transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escribir al WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
