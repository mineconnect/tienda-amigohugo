import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

async function getProducts(categoria?: string): Promise<Product[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lexkcitlapztnqgacvvn.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
    
    if (supabaseKey === "dummy-key") {
      console.warn("Supabase key is missing. Ensure environment variables are set in Vercel.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let query = supabase.from("products").select("*").eq("in_stock", true).order("created_at", { ascending: false });
    
    if (categoria) {
      query = query.ilike("category", `%${categoria}%`);
    }

    const { data, error } = await query;
      
    let mockProducts: Product[] = [
      {
        id: "mock-1",
        name: "Tom Ford Oud Wood",
        description: "Decant premium 5ml",
        price: 15000,
        image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
        category: "Fragancias",
        in_stock: true,
        size: "5ml",
        created_at: new Date().toISOString(),
        notes: null
      },
      {
        id: "mock-2",
        name: "Baccarat Rouge 540",
        description: "Decant premium 10ml",
        price: 28000,
        image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
        category: "Fragancias",
        in_stock: true,
        size: "10ml",
        created_at: new Date().toISOString(),
        notes: null
      },
      {
        id: "mock-3",
        name: "Creed Aventus",
        description: "Decant premium 5ml",
        price: 18000,
        image_url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
        category: "Fragancias",
        in_stock: true,
        size: "5ml",
        created_at: new Date().toISOString(),
        notes: null
      },
      {
        id: "mock-4",
        name: "Dior Sauvage Elixir",
        description: "Decant premium 10ml",
        price: 22000,
        image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
        category: "Fragancias",
        in_stock: true,
        size: "10ml",
        created_at: new Date().toISOString(),
        notes: null
      },
      {
        id: "mock-5",
        name: "Auriculares Premium Noise Cancelling",
        description: "Calidad de sonido superior",
        price: 150000,
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        category: "ELECTRÓNICA",
        in_stock: true,
        size: null,
        created_at: new Date().toISOString(),
        notes: null
      },
      {
        id: "mock-6",
        name: "Bolso de Cuero Genuino",
        description: "Elegancia y durabilidad",
        price: 85000,
        image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
        category: "MODA",
        in_stock: true,
        size: null,
        created_at: new Date().toISOString(),
        notes: null
      },
      {
        id: "mock-7",
        name: "Vela Aromática Artesanal",
        description: "Ambiente relajante",
        price: 12000,
        image_url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
        category: "HOGAR Y ESTILO",
        in_stock: true,
        size: null,
        created_at: new Date().toISOString(),
        notes: null
      },
      {
        id: "mock-8",
        name: "Smartwatch Minimalista",
        description: "Tecnología en tu muñeca",
        price: 110000,
        image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
        category: "GADGETS",
        in_stock: true,
        size: null,
        created_at: new Date().toISOString(),
        notes: null
      }
    ];

    if (categoria) {
      mockProducts = mockProducts.filter(p => p.category?.toUpperCase() === categoria.toUpperCase());
    }

    if (error) {
      console.error("Supabase Error:", error.message);
      return mockProducts;
    }
    return data && data.length > 0 ? data : mockProducts;
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: { searchParams: { categoria?: string } }) {
  const categoria = searchParams?.categoria;
  const products = await getProducts(categoria);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center pt-20 md:pt-32 pb-24 px-6 min-h-[70vh] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-40">
            <div className="absolute w-[150%] h-[1px] bg-gradient-to-r from-transparent via-[#a855f7] to-transparent rotate-[20deg] shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            <div className="absolute w-[150%] h-[1px] bg-gradient-to-r from-transparent via-[#a855f7] to-transparent -rotate-[20deg] shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </div>

          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] max-w-4xl z-10 relative">
            EXPLORA UN UNIVERSO DE PRODUCTOS PREMIUM
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-10 z-10 relative">
            Descubrí nuestra selección curada de artículos de lujo en todas las categorías.
            <br />
            Calidad e innovación para cada estilo de vida.
          </p>
          <a
            href="#catalogo"
            className="z-10 relative inline-block bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105 transition-all duration-300"
          >
            EXPLORAR CATEGORÍAS
          </a>
        </section>

        {/* Trending Now / Catalog */}
        <section id="catalogo" className="max-w-7xl mx-auto px-6 md:px-8 pb-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="font-body text-xl md:text-2xl font-bold text-white uppercase tracking-widest">
              {categoria ? `CATÁLOGO: ${categoria}` : "TENDENCIAS"}
            </h2>
            {categoria && (
              <Link href="/#catalogo" className="text-xs text-primary uppercase tracking-widest hover:underline mt-4 md:mt-0">
                Ver todos
              </Link>
            )}
          </div>
          
          <div className="bg-[#161616] rounded-3xl p-6 md:p-10 border border-white/5">
            {products.length === 0 ? (
              <div className="text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4 block opacity-30">inventory_2</span>
                <p className="text-sm uppercase tracking-widest">No hay artículos en esta categoría</p>
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
              CATEGORÍAS DESTACADAS
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
                { name: "ELECTRÓNICA", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" },
                { name: "MODA", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" },
                { name: "HOGAR Y ESTILO", img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80" },
                { name: "GADGETS", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" },
              ].map((cat) => (
                <Link
                  href={`/?categoria=${encodeURIComponent(cat.name)}#catalogo`}
                  key={cat.name}
                  className="group relative h-80 md:h-[400px] rounded-2xl overflow-hidden border border-white/5 cursor-pointer block"
                >
                  <Image src={cat.img} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center p-6 text-center">
                    <h3 className="text-white font-bold text-lg md:text-xl uppercase tracking-widest">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
