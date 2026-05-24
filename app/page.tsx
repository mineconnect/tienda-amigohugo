import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import type { Product, Category } from "@/lib/supabase";
import { getSettings } from "@/lib/settings";
import Image from "next/image";
import Link from "next/link";

async function getData(categoria?: string): Promise<{
  products: Product[];
  categories: Category[];
  selectedCategory: Category | null;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return { products: [], categories: [], selectedCategory: null };
  }

  try {
    const sb = createClient(supabaseUrl, supabaseKey);

    const [catsRes, catSelRes] = await Promise.all([
      sb.from("categories").select("*").eq("active", true).order("sort_order"),
      categoria
        ? sb.from("categories").select("*").eq("slug", categoria).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    const categories = (catsRes.data as Category[]) || [];
    const selectedCategory = (catSelRes.data as Category | null) || null;

    let query = sb
      .from("products")
      .select("*, category:categories(id, slug, name)")
      .eq("in_stock", true);

    if (selectedCategory) {
      query = query.eq("category_id", selectedCategory.id);
    } else {
      query = query.eq("featured", true);
    }

    const { data: products } = await query
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    return {
      products: (products as Product[]) || [],
      categories,
      selectedCategory,
    };
  } catch (err) {
    console.error("Error loading home data:", err);
    return { products: [], categories: [], selectedCategory: null };
  }
}

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const categoria = searchParams?.categoria;
  const [{ products, categories, selectedCategory }, settings] = await Promise.all([
    getData(categoria),
    getSettings(),
  ]);

  const valueProps = [
    {
      icon: "savings",
      title: settings.valueprop_1_title,
      desc: settings.valueprop_1_desc,
    },
    {
      icon: "checklist",
      title: settings.valueprop_2_title,
      desc: settings.valueprop_2_desc,
    },
    {
      icon: "local_shipping",
      title: settings.valueprop_3_title,
      desc: settings.valueprop_3_desc,
    },
    {
      icon: "support_agent",
      title: settings.valueprop_4_title,
      desc: settings.valueprop_4_desc,
    },
  ];

  return (
    <>
      <Navbar categories={categories} />
      <main className="relative">
        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,97,0.12),_transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(183,148,246,0.06),_transparent_60%)]" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-gold-400/15 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center pt-20">
            <p className="eyebrow justify-center mb-8 animate-fade-in">
              {settings.hero_eyebrow}
            </p>

            <h1 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] font-medium leading-[1.05] text-balance text-bone mb-8 animate-fade-up">
              {settings.hero_title}
              <br />
              <span className="italic text-gold-gradient font-normal">
                {settings.hero_title_italic}
              </span>
            </h1>

            <p
              className="max-w-2xl mx-auto text-base md:text-lg text-bone/70 leading-relaxed mb-12 animate-fade-up"
              style={{ animationDelay: "150ms" }}
            >
              {settings.hero_subtitle}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link href="#catalogo" className="btn-gold">
                {settings.hero_cta_primary || "Ver catálogo"}
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </Link>
              <a
                href={`https://wa.me/${settings.contact_whatsapp || "5493834789035"}`}
                target="_blank"
                rel="noopener"
                className="btn-outline"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chat
                </span>
                {settings.hero_cta_secondary || "Hablar por WhatsApp"}
              </a>
            </div>

            <div
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-20 pt-10 border-t border-gold-400/10 animate-fade-up"
              style={{ animationDelay: "450ms" }}
            >
              {[
                { num: settings.metric_1_value, lbl: settings.metric_1_label },
                { num: settings.metric_2_value, lbl: settings.metric_2_label },
                { num: settings.metric_3_value, lbl: settings.metric_3_label },
              ].map((m) => (
                <div key={m.lbl} className="text-center">
                  <div className="font-display text-3xl md:text-4xl text-gold-gradient">
                    {m.num}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted mt-2">
                    {m.lbl}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in">
            <span className="text-[9px] uppercase tracking-ultra text-muted">
              Descubrir
            </span>
            <span className="material-symbols-outlined text-gold-400/60 animate-bounce">
              expand_more
            </span>
          </div>
        </section>

        {/* VALUE PROPS */}
        <section className="border-y border-gold-400/10 bg-ink-900/40 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {valueProps.map((v) => (
              <div
                key={v.title}
                className="flex flex-col items-center text-center md:flex-row md:text-left gap-4"
              >
                <span className="material-symbols-outlined text-gold-400 text-[28px] flex-shrink-0">
                  {v.icon}
                </span>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-bone mb-1">
                    {v.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CATÁLOGO */}
        <section
          id="catalogo"
          className="max-w-[1400px] mx-auto px-6 md:px-10 py-24"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div>
              <p className="eyebrow mb-4">Catálogo</p>
              <h2 className="font-display text-4xl md:text-5xl font-medium text-bone leading-tight">
                {selectedCategory ? (
                  <span className="italic text-gold-gradient">
                    {selectedCategory.name}
                  </span>
                ) : (
                  <>
                    Productos{" "}
                    <span className="italic text-gold-gradient">destacados</span>
                  </>
                )}
              </h2>
              <p className="text-sm text-muted mt-3 max-w-md">
                {selectedCategory
                  ? selectedCategory.description ||
                    "Selección curada para esta categoría."
                  : "Lo que más nos están pidiendo este mes. ¿Buscás algo distinto? Mirá todas las categorías abajo."}
              </p>
            </div>
            {selectedCategory && (
              <Link
                href="/#catalogo"
                className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                Ver todo
              </Link>
            )}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-32 border border-dashed border-gold-400/15 rounded-3xl">
              <span className="material-symbols-outlined text-7xl mb-6 block text-gold-400/30">
                inventory_2
              </span>
              <p className="text-sm uppercase tracking-widest text-muted mb-2">
                {selectedCategory
                  ? "No hay productos en esta categoría todavía"
                  : "Cargando el catálogo..."}
              </p>
              <Link
                href="/#catalogo"
                className="text-xs uppercase tracking-widest text-gold-400 hover:underline"
              >
                {selectedCategory ? "Volver al catálogo completo" : "Ver todo"}
              </Link>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>

        {/* CATEGORÍAS */}
        {!selectedCategory && categories.length > 0 && (
          <section className="max-w-[1400px] mx-auto px-6 md:px-10 pb-24">
            <div className="text-center mb-14">
              <p className="eyebrow justify-center mb-4">Categorías</p>
              <h2 className="font-display text-4xl md:text-5xl font-medium text-bone">
                Explorá{" "}
                <span className="italic text-gold-gradient">por categoría</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {categories.map((cat) => (
                <Link
                  href={`/?categoria=${cat.slug}#catalogo`}
                  key={cat.id}
                  className="group relative h-[260px] rounded-3xl overflow-hidden border border-gold-400/10 cursor-pointer block hairline bg-gradient-to-br from-ink-700 to-ink-900"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,169,97,0.15),_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative h-full z-10 flex flex-col items-center justify-center p-8 text-center">
                    <span className="material-symbols-outlined text-5xl text-gold-400 mb-4 group-hover:scale-110 transition-transform duration-500">
                      {cat.icon || "category"}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-bone mb-2 group-hover:text-gold-400 transition-colors duration-500">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-[11px] text-muted leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SOBRE VÍCTOR HUGO */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,97,0.06),_transparent_70%)]" />
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <p className="eyebrow justify-center mb-6">{settings.about_title}</p>
            <p className="font-display italic text-2xl md:text-4xl leading-snug text-bone/90 text-balance mb-10">
              &ldquo;{settings.about_text}&rdquo;
            </p>
            <div className="divider-gold max-w-xs mx-auto mb-8">
              <span className="material-symbols-outlined text-gold-400 text-[18px]">
                explore
              </span>
            </div>
            <Link
              href="/sobre-nosotros"
              className="inline-flex items-center gap-2 mt-4 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
            >
              Leer más
              <span className="material-symbols-outlined text-[14px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>

        {/* CTA WHATSAPP */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 pb-24">
          <div className="glass-card hairline rounded-3xl p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="eyebrow mb-4">¿Dudas?</p>
              <h3 className="font-display text-3xl md:text-4xl text-bone mb-4">
                Te asesoramos antes de comprar
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-8">
                ¿No estás seguro de talles, colores o stock? Escribinos por WhatsApp y te respondemos al toque. Sin formularios, sin vueltas — directo con Víctor Hugo.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${settings.contact_whatsapp || "5493834789035"}?text=Hola%21%20Tengo%20una%20consulta`}
                  target="_blank"
                  rel="noopener"
                  className="btn-gold"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    chat
                  </span>
                  Hablar por WhatsApp
                </a>
                <Link href="/faq" className="btn-outline">
                  Ver preguntas frecuentes
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "¿Hacen envíos a todo el país?",
                  a: "Sí, despachamos por correo o encomienda a cualquier punto de Argentina con tracking.",
                },
                {
                  q: "¿Cómo pago?",
                  a: "Transferencia bancaria, Mercado Pago o efectivo si retirás en Belén.",
                },
                {
                  q: "¿Tienen local físico?",
                  a: "Sí, en Belén (Catamarca). Coordinamos por WhatsApp para mostrarte.",
                },
              ].map((f) => (
                <details
                  key={f.q}
                  className="group border-b border-gold-400/10 pb-4"
                >
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="font-display text-lg text-bone group-hover:text-gold-400 transition-colors">
                      {f.q}
                    </span>
                    <span className="material-symbols-outlined text-gold-400 transition-transform group-open:rotate-45">
                      add
                    </span>
                  </summary>
                  <p className="text-sm text-muted leading-relaxed mt-3">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer categories={categories} settings={settings} />
    </>
  );
}
