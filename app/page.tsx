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
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center pt-20 md:pt-32 pb-24 px-6 min-h-[70vh] overflow-hidden">
          {/* Abstract Purple Lines matching the image */}
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-40">
            <div className="absolute w-[150%] h-[1px] bg-gradient-to-r from-transparent via-[#a855f7] to-transparent rotate-[20deg] shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            <div className="absolute w-[150%] h-[1px] bg-gradient-to-r from-transparent via-[#a855f7] to-transparent -rotate-[20deg] shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </div>

          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] max-w-4xl z-10 relative">
            EXPLORE A UNIVERSE OF PREMIUM GOODS
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-10 z-10 relative">
            Discover our curated selection of luxury items across all categories.
            <br />
            Quality and innovation for every lifestyle.
          </p>
          <a
            href="#catalogo"
            className="z-10 relative inline-block bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105 transition-all duration-300"
          >
            BROWSE CATEGORIES
          </a>
        </section>

        {/* Trending Now */}
        <section id="catalogo" className="max-w-7xl mx-auto px-6 md:px-8 pb-16">
          <div className="text-center mb-10">
            <h2 className="font-body text-xl md:text-2xl font-bold text-white uppercase tracking-widest">
              TRENDING NOW
            </h2>
          </div>
          
          <div className="bg-[#161616] rounded-3xl p-6 md:p-10 border border-white/5">
            {products.length === 0 ? (
              <div className="text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4 block opacity-30">inventory_2</span>
                <p className="text-sm uppercase tracking-widest">Catálogo en preparación</p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </section>

        {/* Featured Categories */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
          <div className="text-center mb-10">
            <h2 className="font-body text-xl md:text-2xl font-bold text-white uppercase tracking-widest">
              FEATURED CATEGORIES
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {["ELECTRONICS", "FASHION", "HOME & LIVING", "GADGETS"].map((cat) => (
              <div 
                key={cat}
                className="group relative h-80 md:h-[400px] rounded-2xl overflow-hidden bg-[#1f1f1f] border border-white/5 cursor-pointer"
              >
                {/* Simulated images with gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a] z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a1a1a] to-[#2a2a2a] group-hover:scale-105 transition-transform duration-700" />
                
                <div className="absolute inset-0 z-20 flex items-center justify-center p-6 text-center">
                  <h3 className="text-white font-bold text-lg md:text-xl uppercase tracking-widest">
                    {cat}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
