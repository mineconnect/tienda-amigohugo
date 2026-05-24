import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

async function getProducts(categoria?: string): Promise<Product[]> {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://lexkcitlapztnqgacvvn.supabase.co";
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";

    if (supabaseKey === "dummy-key") {
      console.warn(
        "Supabase key is missing. Ensure environment variables are set in Vercel."
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let query = supabase.from("products").select("*").eq("in_stock", true);

    if (categoria) {
      query = query.ilike("category", `%${categoria}%`);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Supabase Error:", error.message);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";

const FAMILIES = [
  {
    name: "Niche",
    desc: "Casas exclusivas. Tiraje limitado.",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Designer",
    desc: "Íconos del mainstream de lujo.",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Árabes",
    desc: "Oud, ámbar y resinas de Oriente.",
    img: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Editorial",
    desc: "Nuestra selección curada del mes.",
    img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80",
  },
];

const VALUE_PROPS = [
  {
    icon: "verified",
    title: "100% Originales",
    desc: "Fraccionados desde el frasco original. Cada decant lleva firma del lote.",
  },
  {
    icon: "science",
    title: "Fraccionado Profesional",
    desc: "Atomizadores nuevos de vidrio. Trasvasado en ambiente controlado.",
  },
  {
    icon: "local_shipping",
    title: "Envíos a todo el país",
    desc: "Despacho 24-48 hs por Andreani y Correo Argentino. Tracking incluido.",
  },
  {
    icon: "support_agent",
    title: "Asesoría Olfativa",
    desc: "Ayuda a elegir según tu perfil, ocasión y temporada. Por WhatsApp.",
  },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const categoria = searchParams?.categoria;
  const products = await getProducts(categoria);

  return (
    <>
      <Navbar />
      <main className="relative">
        {/* ───────────────── HERO ───────────────── */}
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
          {/* Background atmospheric layers */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,97,0.12),_transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(183,148,246,0.06),_transparent_60%)]" />
            {/* Líneas finas doradas tipo art-deco */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-gold-400/15 to-transparent" />
          </div>

          {/* Frame contenido */}
          <div className="relative z-10 max-w-5xl mx-auto text-center pt-20">
            <p className="eyebrow justify-center mb-8 animate-fade-in">
              Atelier de Perfumería · Est. 2024
            </p>

            <h1 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] font-medium leading-[1.05] text-balance text-bone mb-8 animate-fade-up">
              El arte de oler bien,
              <br />
              <span className="italic text-gold-gradient font-normal">
                fraccionado en 5 ml.
              </span>
            </h1>

            <p
              className="max-w-2xl mx-auto text-base md:text-lg text-bone/70 leading-relaxed mb-12 animate-fade-up"
              style={{ animationDelay: "150ms" }}
            >
              Probá los perfumes más codiciados del planeta antes de invertir en
              un frasco completo. Decants 100% originales fraccionados a mano
              desde el frasco oficial.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link href="#catalogo" className="btn-gold">
                Explorar Catálogo
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </Link>
              <Link href="/sobre-nosotros" className="btn-outline">
                Qué es un decant
              </Link>
            </div>

            {/* Métricas debajo del hero */}
            <div
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-20 pt-10 border-t border-gold-400/10 animate-fade-up"
              style={{ animationDelay: "450ms" }}
            >
              {[
                { num: "120+", lbl: "Fragancias en stock" },
                { num: "100%", lbl: "Originales garantizado" },
                { num: "48h",  lbl: "Despacho promedio" },
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

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in">
            <span className="text-[9px] uppercase tracking-ultra text-muted">
              Descubrir
            </span>
            <span className="material-symbols-outlined text-gold-400/60 animate-bounce">
              expand_more
            </span>
          </div>
        </section>

        {/* ───────────────── BARRA DE VALORES ───────────────── */}
        <section className="border-y border-gold-400/10 bg-ink-900/40 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {VALUE_PROPS.map((v) => (
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

        {/* ───────────────── CATÁLOGO ───────────────── */}
        <section
          id="catalogo"
          className="max-w-[1400px] mx-auto px-6 md:px-10 py-24"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div>
              <p className="eyebrow mb-4">Catálogo</p>
              <h2 className="font-display text-4xl md:text-5xl font-medium text-bone leading-tight">
                {categoria ? (
                  <>
                    <span className="italic text-gold-gradient">
                      {categoria}
                    </span>
                  </>
                ) : (
                  <>
                    Tendencias <span className="italic text-gold-gradient">de la casa</span>
                  </>
                )}
              </h2>
              <p className="text-sm text-muted mt-3 max-w-md">
                {categoria
                  ? "Selección curada para esta familia olfativa."
                  : "Los decants más pedidos del mes, elegidos por nuestra comunidad."}
              </p>
            </div>
            {categoria && (
              <Link
                href="/#catalogo"
                className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                Ver todo el catálogo
              </Link>
            )}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-32 border border-dashed border-gold-400/15 rounded-3xl">
              <span className="material-symbols-outlined text-7xl mb-6 block text-gold-400/30">
                local_florist
              </span>
              <p className="text-sm uppercase tracking-widest text-muted mb-2">
                No hay fragancias en esta categoría
              </p>
              <Link
                href="/#catalogo"
                className="text-xs uppercase tracking-widest text-gold-400 hover:underline"
              >
                Volver al catálogo completo
              </Link>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>

        {/* ───────────────── FAMILIAS / CATEGORÍAS ───────────────── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 pb-24">
          <div className="text-center mb-14">
            <p className="eyebrow justify-center mb-4">Familias</p>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-bone">
              Encontrá <span className="italic text-gold-gradient">tu universo</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FAMILIES.map((cat, idx) => (
              <Link
                href={`/?categoria=${encodeURIComponent(cat.name)}#catalogo`}
                key={cat.name}
                className="group relative h-[440px] rounded-3xl overflow-hidden border border-gold-400/10 cursor-pointer block hairline"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/10 z-10" />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                  <h3 className="font-display text-3xl font-semibold text-bone mb-2 group-hover:text-gold-400 transition-colors duration-500">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-bone/70 leading-relaxed mb-4">
                    {cat.desc}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Explorar
                    <span className="material-symbols-outlined text-[14px]">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ───────────────── HISTORIA / MANIFIESTO ───────────────── */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,97,0.06),_transparent_70%)]" />
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <p className="eyebrow justify-center mb-6">Manifiesto</p>
            <p className="font-display italic text-2xl md:text-4xl leading-snug text-bone/90 text-balance mb-10">
              &ldquo;El perfume es la forma más intensa del recuerdo. Nuestra
              misión es que puedas probar — sin riesgo — los que merecen quedar
              en tu memoria.&rdquo;
            </p>
            <div className="divider-gold max-w-xs mx-auto mb-8">
              <span className="material-symbols-outlined text-gold-400 text-[18px]">
                spa
              </span>
            </div>
            <p className="text-sm text-muted max-w-2xl mx-auto leading-relaxed">
              VHF nace de la frustración de gastar fortunas en frascos que
              terminan olvidados en el cajón. Fraccionamos los perfumes más
              icónicos del mundo para que descubras tu firma olfativa con la
              libertad que merece.
            </p>
            <Link
              href="/sobre-nosotros"
              className="inline-flex items-center gap-2 mt-10 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
            >
              Leer nuestra historia
              <span className="material-symbols-outlined text-[14px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>

        {/* ───────────────── FAQ TEASER ───────────────── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 pb-24">
          <div className="glass-card hairline rounded-3xl p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="eyebrow mb-4">¿Dudas?</p>
              <h3 className="font-display text-3xl md:text-4xl text-bone mb-4">
                Te asesoramos antes de comprar
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-8">
                ¿No sabés cuál elegir? Contanos qué te gusta — un perfume que ya
                usás, una ocasión, una estación del año — y armamos un combo a
                tu medida. Sin compromiso.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/5493834789035?text=Hola%21%20Quiero%20asesor%C3%ADa%20olfativa"
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
                  Ver FAQ
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "¿Son originales?",
                  a: "Sí. Fraccionamos desde el frasco original y conservamos los lotes para chequeo.",
                },
                {
                  q: "¿Cuánto rinde un 5 ml?",
                  a: "Aprox. 60–80 sprays. Te alcanza para 1 a 2 meses de uso ocasional.",
                },
                {
                  q: "¿Hacen envíos al interior?",
                  a: "Sí. Despachamos por Andreani y Correo Argentino con tracking.",
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
      <Footer />
    </>
  );
}
