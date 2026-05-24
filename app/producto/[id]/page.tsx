import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import AddToCartButton from "./AddToCartButton";
import { getSettings } from "@/lib/settings";
import { createPublicClient } from "@/lib/publicSupabase";
import type { Product, Category } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getProduct(id: string): Promise<Product | null> {
  const sb = createPublicClient();
  const { data, error } = await sb
    .from("products")
    .select("*, category:categories(id, slug, name, description)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Product;
}

async function getRelated(categoryId: string | null, excludeId: string) {
  const sb = createPublicClient();
  let query = sb
    .from("products")
    .select("*, category:categories(id, slug, name)")
    .eq("in_stock", true)
    .neq("id", excludeId)
    .limit(4);
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data } = await query;
  return (data as Product[]) || [];
}

async function getCategories(): Promise<Category[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  return (data as Category[]) || [];
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const [related, categories, settings] = await Promise.all([
    getRelated(product.category_id, product.id),
    getCategories(),
    getSettings(),
  ]);

  return (
    <>
      <Navbar categories={categories} />
      <main className="pt-28 pb-24 px-6 md:px-10 max-w-[1400px] mx-auto min-h-screen">
        <nav className="flex items-center flex-wrap gap-2 text-[10px] uppercase tracking-widest text-muted mb-10">
          <Link href="/" className="hover:text-gold-400">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/#catalogo" className="hover:text-gold-400">
            Catálogo
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/?categoria=${product.category.slug}#catalogo`}
                className="hover:text-gold-400"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-bone/80 normal-case tracking-normal">
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Imagen */}
          <div className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden glass-card hairline">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-gold-400/30">
                  inventory_2
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/60 to-transparent pointer-events-none" />
            {product.featured && (
              <div className="absolute top-5 left-5 px-3 py-1.5 bg-gold-400/95 rounded-full text-[10px] font-bold uppercase tracking-widest text-ink-950">
                ★ Destacado
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.category && (
              <p className="eyebrow mb-5">{product.category.name}</p>
            )}

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-bone leading-[1.1] mb-6">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-base text-bone/75 leading-relaxed mb-8 max-w-xl">
                {product.description}
              </p>
            )}

            {/* Atributos */}
            {(product.size || product.color || product.stock_qty > 0) && (
              <div className="flex flex-wrap gap-3 mb-8">
                {product.size && (
                  <div className="px-4 py-2 bg-ink-900/50 border border-gold-400/15 rounded-full">
                    <span className="text-[10px] uppercase tracking-widest text-muted">
                      Talle
                    </span>
                    <span className="ml-2 text-sm text-bone">
                      {product.size}
                    </span>
                  </div>
                )}
                {product.color && (
                  <div className="px-4 py-2 bg-ink-900/50 border border-gold-400/15 rounded-full">
                    <span className="text-[10px] uppercase tracking-widest text-muted">
                      Color
                    </span>
                    <span className="ml-2 text-sm text-bone">
                      {product.color}
                    </span>
                  </div>
                )}
                {product.stock_qty > 0 && product.in_stock && (
                  <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-400/30 rounded-full">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-300">
                      {product.stock_qty} disponibles
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Precio */}
            <div className="flex items-end gap-6 mb-10 pb-10 border-b border-gold-400/15">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-1">
                  Precio
                </p>
                <p className="font-display text-5xl font-medium text-gold-gradient">
                  ${product.price.toLocaleString("es-AR")}
                </p>
              </div>
            </div>

            <AddToCartButton product={product} />

            <div className="grid grid-cols-3 gap-3 mt-10 pt-8 border-t border-gold-400/10">
              {[
                { icon: "local_shipping", lbl: "Envíos al país" },
                { icon: "verified_user", lbl: "Compra segura" },
                { icon: "support_agent", lbl: "Asesoría WhatsApp" },
              ].map((g) => (
                <div
                  key={g.lbl}
                  className="flex flex-col items-center text-center"
                >
                  <span className="material-symbols-outlined text-gold-400 text-[22px] mb-2">
                    {g.icon}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted">
                    {g.lbl}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-32">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow mb-3">También te puede gustar</p>
                <h2 className="font-display text-3xl md:text-4xl text-bone">
                  Productos similares
                </h2>
              </div>
              <Link
                href="/#catalogo"
                className="text-xs uppercase tracking-widest text-gold-400 hover:underline"
              >
                Ver todo
              </Link>
            </div>
            <ProductGrid products={related} />
          </section>
        )}
      </main>
      <Footer categories={categories} settings={settings} />
    </>
  );
}
