import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { createPublicClient } from "@/lib/publicSupabase";
import type { Category } from "@/lib/supabase";

export const metadata = {
  title: "Preguntas frecuentes — VHF Decants",
  description:
    "Resolvemos tus dudas sobre cómo comprar, formas de pago, envíos y devoluciones.",
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

const SECTIONS = [
  {
    id: "comprar",
    title: "Cómo comprar",
    items: [
      {
        q: "¿Cómo hago un pedido?",
        a: "Es muy fácil: navegá el catálogo, tocá el botón + para agregar productos al carrito, después entrá al carrito y tocá 'Finalizar por WhatsApp'. Se abre WhatsApp con tu pedido ya armado — solo tenés que tocar enviar.",
      },
      {
        q: "¿Necesito crearme una cuenta?",
        a: "No, no hace falta. Tu carrito se guarda en tu dispositivo y la compra se concreta por WhatsApp.",
      },
      {
        q: "¿Puedo pedir algo que no esté en el catálogo?",
        a: "Escribinos por WhatsApp y vemos si lo podemos conseguir.",
      },
    ],
  },
  {
    id: "pagos",
    title: "Formas de pago",
    items: [
      {
        q: "¿Qué medios de pago aceptan?",
        a: "Transferencia bancaria a CBU, Mercado Pago (link de pago con todas las tarjetas y cuotas según la promo vigente) y efectivo si retirás en Belén.",
      },
      {
        q: "¿Cuándo se paga?",
        a: "Después de confirmar el pedido por WhatsApp, te paso los datos para el pago. La mercadería sale una vez acreditado.",
      },
      {
        q: "¿Aceptan cuotas sin interés?",
        a: "Depende de la promo bancaria del momento. Por Mercado Pago muchas veces salen 3 o 6 cuotas sin interés. Consultame al momento del pedido.",
      },
    ],
  },
  {
    id: "envios",
    title: "Envíos",
    items: [
      {
        q: "¿Hacen envíos a todo el país?",
        a: "Sí, despachamos por correo o encomienda a cualquier ciudad de Argentina con código de seguimiento.",
      },
      {
        q: "¿Cuánto tarda el envío?",
        a: "A capitales de provincia: 3-7 días hábiles. Al interior profundo: 7-12 días hábiles, dependiendo del correo.",
      },
      {
        q: "¿Cuánto cuesta el envío?",
        a: "Depende del peso y la zona. Se lo paga directo al correo al retirarlo. En compras grandes podemos coordinar envío gratis o con descuento.",
      },
      {
        q: "¿Puedo retirar en Belén?",
        a: "Por supuesto. Si vivís en Belén o cerca, coordinamos por WhatsApp para que pases a buscarlo.",
      },
    ],
  },
  {
    id: "productos",
    title: "Productos y stock",
    items: [
      {
        q: "¿Las fotos son reales?",
        a: "Sí, todas las fotos las tomamos nosotros o son del fabricante original. Si querés ver fotos extras o detalles, pedímelos por WhatsApp.",
      },
      {
        q: "¿Hay stock garantizado?",
        a: "Trabajamos con stock real cargado en la web. Si algo se vendió antes de que actualice, te aviso al toque por WhatsApp y vemos alternativas.",
      },
      {
        q: "¿Qué pasa si el producto no es lo que esperaba?",
        a: "Tenés hasta 7 días desde que lo recibís para cambiarlo o devolverlo (siempre que esté sin uso y con etiquetas). Los costos de envío del cambio van por cuenta del comprador.",
      },
    ],
  },
];

export default async function FaqPage() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);

  return (
    <>
      <Navbar categories={categories} />
      <main className="pt-28 pb-24 px-6 md:px-10 max-w-5xl mx-auto">
        <section className="text-center py-16 md:py-24">
          <p className="eyebrow justify-center mb-5">Soporte</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-bone leading-[1.05] mb-6 text-balance">
            Preguntas{" "}
            <span className="italic text-gold-gradient">frecuentes</span>
          </h1>
          <p className="text-lg text-bone/70 max-w-2xl mx-auto leading-relaxed">
            Todo lo que necesitás saber antes de comprar.
          </p>
        </section>

        <nav className="flex flex-wrap justify-center gap-3 mb-16 pb-10 border-b border-gold-400/10">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-5 py-2 rounded-full text-xs uppercase tracking-widest text-bone/70 border border-gold-400/20 hover:text-gold-400 hover:border-gold-400/60 transition-colors"
            >
              {s.title}
            </a>
          ))}
        </nav>

        <div className="space-y-20">
          {SECTIONS.map((section, idx) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display italic text-4xl text-gold-gradient">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-bone">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group glass-card hairline rounded-2xl px-6 py-5 hover:border-gold-400/30 transition-colors"
                  >
                    <summary className="flex justify-between items-start gap-6 cursor-pointer list-none">
                      <span className="font-display text-lg md:text-xl text-bone group-hover:text-gold-400 transition-colors flex-1">
                        {item.q}
                      </span>
                      <span className="material-symbols-outlined text-gold-400 transition-transform duration-500 group-open:rotate-45 flex-shrink-0 mt-0.5">
                        add
                      </span>
                    </summary>
                    <p className="text-sm md:text-base text-bone/75 leading-relaxed mt-4 pt-4 border-t border-gold-400/10">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-24 text-center glass-card hairline rounded-3xl p-12">
          <p className="eyebrow justify-center mb-5">¿Seguís con dudas?</p>
          <h3 className="font-display text-3xl md:text-4xl font-bold text-bone mb-4">
            Escribinos
          </h3>
          <p className="text-sm text-muted max-w-md mx-auto mb-8">
            Te respondemos en minutos.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`https://wa.me/${settings.contact_whatsapp || "5493834789035"}?text=Hola%21%20Tengo%20una%20consulta`}
              target="_blank"
              rel="noopener"
              className="btn-gold"
            >
              <span className="material-symbols-outlined text-[16px]">
                chat
              </span>
              Escribir por WhatsApp
            </a>
            <Link href="/#catalogo" className="btn-outline">
              Volver al catálogo
            </Link>
          </div>
        </section>
      </main>
      <Footer categories={categories} settings={settings} />
    </>
  );
}
