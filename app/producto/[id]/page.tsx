import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getProduct(id: string): Promise<Product | null> {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://lexkcitlapztnqgacvvn.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Product;
}

async function getRelated(category: string | null, excludeId: string) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://lexkcitlapztnqgacvvn.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
  const supabase = createClient(supabaseUrl, supabaseKey);

  let query = supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .neq("id", excludeId)
    .limit(4);
  if (category) query = query.ilike("category", `%${category}%`);
  const { data } = await query;
  return (data as Product[]) || [];
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const related = await getRelated(product.category, product.id);

  // Reparto simbólico de la pirámide olfativa
  const notes = product.notes || [];
  const top = notes.slice(0, Math.ceil(notes.length / 3));
  const heart = notes.slice(
    Math.ceil(notes.length / 3),
    Math.ceil((notes.length * 2) / 3)
  );
  const base = notes.slice(Math.ceil((notes.length * 2) / 3));

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-6 md:px-10 max-w-[1400px] mx-auto min-h-screen">
        {/* Migas */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted mb-10">
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
                href={`/?categoria=${encodeURIComponent(product.category)}#catalogo`}
                className="hover:text-gold-400"
              >
                {product.category}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-bone/80">{product.name}</span>
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
                  local_florist
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/60 to-transparent pointer-events-none" />
            {product.size && (
              <div className="absolute top-5 left-5 px-3 py-1.5 bg-ink-950/70 backdrop-blur-md rounded-full text-[10px] font-medium uppercase tracking-widest text-gold-300 border border-gold-400/20">
                Tamaño · {product.size}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.category && (
              <p className="eyebrow mb-5">{product.category}</p>
            )}

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-bone leading-[1.1] mb-6">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-base text-bone/75 leading-relaxed mb-8 max-w-xl">
                {product.description}
              </p>
            )}

            {/* Precio + CTA */}
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

            {/* Pirámide olfativa */}
            {notes.length > 0 && (
              <div className="mt-12">
                <p className="eyebrow mb-6">Pirámide olfativa</p>
                <div className="space-y-5">
                  {top.length > 0 && (
                    <NotesRow label="Salida" notes={top} weight={1} />
                  )}
                  {heart.length > 0 && (
                    <NotesRow label="Corazón" notes={heart} weight={2} />
                  )}
                  {base.length > 0 && (
                    <NotesRow label="Fondo" notes={base} weight={3} />
                  )}
                </div>
              </div>
            )}

            {/* Garantías inline */}
            <div className="grid grid-cols-3 gap-3 mt-10 pt-8 border-t border-gold-400/10">
              {[
                { icon: "verified", lbl: "100% Original" },
                { icon: "local_shipping", lbl: "Envío 24-48h" },
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
                  De la misma familia
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
      <Footer />
    </>
  );
}

function NotesRow({
  label,
  notes,
  weight,
}: {
  label: string;
  notes: string[];
  weight: number;
}) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-6 items-start">
      <div className="text-[10px] uppercase tracking-widest text-gold-400 pt-1.5">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {notes.map((n) => (
          <span
            key={n}
            className="note-tag"
            style={{
              fontSize: weight === 3 ? "0.7rem" : "0.65rem",
              padding:
                weight === 3 ? "0.35rem 0.85rem" : "0.25rem 0.65rem",
            }}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
