import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import type { Category } from "@/lib/supabase";

export const metadata = {
  title: "Sobre nosotros — VHF Importaciones de Belén",
  description:
    "Conocé a Víctor Hugo Figueroa, sus viajes a Salta y Bolivia y cómo elige los productos para su tienda en Belén, Catamarca.",
};

export const dynamic = "force-dynamic";

async function getCategories(): Promise<Category[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const sb = createClient(url, key);
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

const PROCESS = [
  {
    step: "01",
    title: "Viaje y selección",
    text: "Víctor Hugo viaja a Salta y Bolivia varias veces al año. Recorre ferias, talleres y proveedores locales. Toca, prueba y elige solo lo que valdría la pena para su propia familia.",
  },
  {
    step: "02",
    title: "Negociación directa",
    text: "Compra sin intermediarios. Eso nos permite ofrecerte precios mucho mejores que cualquier cadena, sin sacrificar la calidad del producto.",
  },
  {
    step: "03",
    title: "Traslado a Belén",
    text: "Trae la mercadería a Belén (Catamarca) con todos los papeles en regla. Cada lote se revisa antes de cargarlo a la tienda online.",
  },
  {
    step: "04",
    title: "Envío a tu casa",
    text: "Coordinamos por WhatsApp el pago y el envío. Despachamos por correo o encomienda a toda Argentina con tracking. Si vivís en Belén, podés retirar en mano.",
  },
];

export default async function AboutPage() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);

  return (
    <>
      <Navbar categories={categories} />
      <main className="pt-28 pb-24 px-6 md:px-10 max-w-[1400px] mx-auto">
        <section className="relative py-20 md:py-32 text-center max-w-4xl mx-auto">
          <p className="eyebrow justify-center mb-6">Conocenos</p>
          <h1 className="font-display text-5xl md:text-7xl font-medium text-bone leading-[1.05] mb-8 text-balance">
            Soy Víctor Hugo y{" "}
            <span className="italic text-gold-gradient">
              esto es lo que hago.
            </span>
          </h1>
          <p className="text-lg text-bone/75 leading-relaxed max-w-2xl mx-auto">
            {settings.about_text}
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-16 items-center py-20 border-t border-gold-400/10">
          <div>
            <p className="eyebrow mb-5">Cómo nació la tienda</p>
            <h2 className="font-display text-4xl md:text-5xl text-bone mb-6 leading-tight">
              De Belén al norte,{" "}
              <span className="italic text-gold-gradient">y de vuelta.</span>
            </h2>
            <div className="space-y-5 text-bone/75 leading-relaxed">
              <p>
                Vivo en{" "}
                <strong className="text-gold-400">Belén, Catamarca</strong>{" "}
                desde siempre. Hace años que viajo a Salta y a Bolivia por trabajo y por gusto, y siempre volvía con bolsos llenos de cosas que acá no se conseguían — ropa con buenos materiales, artesanías, productos de cocina, electrónica útil.
              </p>
              <p>
                La gente del barrio empezó a pedirme cosas: &ldquo;la próxima traeme una campera como esa&rdquo;, &ldquo;si vas a Bolivia, fijate si hay manteles tejidos&rdquo;. Lo que empezó como favores se convirtió en negocio. Y ahora tenés todo el catálogo a un clic.
              </p>
              <p>
                Mi promesa es simple: si yo no me lo pondría, no lo subo a la tienda. Y si tenés alguna duda — talles, telas, colores, lo que sea — me escribís por WhatsApp y te respondo yo mismo.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card hairline">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="font-display italic text-2xl text-bone">
                &ldquo;Los mejores negocios{" "}
                <span className="text-gold-gradient">
                  se hacen mirando a los ojos.
                </span>
                &rdquo;
              </p>
              <p className="text-xs uppercase tracking-widest text-muted mt-4">
                — Víctor Hugo
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-gold-400/10">
          <div className="text-center mb-16">
            <p className="eyebrow justify-center mb-4">Cómo trabajamos</p>
            <h2 className="font-display text-4xl md:text-5xl text-bone">
              Nuestro{" "}
              <span className="italic text-gold-gradient">proceso</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <div
                key={p.step}
                className="glass-card hairline rounded-2xl p-7 hover:border-gold-400/30 transition-colors"
              >
                <div className="font-display text-5xl text-gold-gradient mb-4">
                  {p.step}
                </div>
                <h3 className="font-display text-xl text-bone mb-3">
                  {p.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 text-center border-t border-gold-400/10">
          <p className="eyebrow justify-center mb-6">Próximo paso</p>
          <h2 className="font-display text-4xl md:text-5xl text-bone mb-6">
            ¿Listo para hacer tu primer pedido?
          </h2>
          <p className="text-bone/70 max-w-xl mx-auto mb-10">
            Mirá el catálogo, agregá al carrito y cerramos por WhatsApp. Tan simple como eso.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#catalogo" className="btn-gold">
              Ver catálogo
            </Link>
            <a
              href={`https://wa.me/${settings.contact_whatsapp || "5493834789035"}?text=Hola%21%20Quiero%20hacer%20una%20consulta`}
              target="_blank"
              rel="noopener"
              className="btn-outline"
            >
              <span className="material-symbols-outlined text-[16px]">
                chat
              </span>
              WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer categories={categories} settings={settings} />
    </>
  );
}
