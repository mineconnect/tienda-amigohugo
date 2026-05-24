import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Sobre nosotros — VHF Decants",
  description:
    "Conocé la historia de VHF Decants, nuestro proceso de fraccionado y por qué garantizamos 100% originalidad.",
};

const PROCESS = [
  {
    step: "01",
    title: "Selección obsesiva",
    text: "Compramos solo en boutiques oficiales y distribuidores autorizados. Cada lote queda registrado con foto del frasco original.",
  },
  {
    step: "02",
    title: "Fraccionado en atelier",
    text: "Transvasamos en un ambiente controlado, sin contacto con luz directa ni calor. Cada decant lleva un atomizador nuevo de vidrio óptico.",
  },
  {
    step: "03",
    title: "Sellado y etiquetado",
    text: "Sellamos con film de seguridad, etiquetamos con número de lote y empacamos en caja rígida con relleno antichoque.",
  },
  {
    step: "04",
    title: "Despacho con tracking",
    text: "Enviamos por Andreani o Correo Argentino. Cada cliente recibe foto de su pedido antes del despacho y código de seguimiento.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-6 md:px-10 max-w-[1400px] mx-auto">
        {/* Hero */}
        <section className="relative py-20 md:py-32 text-center max-w-4xl mx-auto">
          <p className="eyebrow justify-center mb-6">Editorial</p>
          <h1 className="font-display text-5xl md:text-7xl font-medium text-bone leading-[1.05] mb-8 text-balance">
            Un decant es <span className="italic text-gold-gradient">una oportunidad.</span>
          </h1>
          <p className="text-lg text-bone/75 leading-relaxed max-w-2xl mx-auto">
            La oportunidad de oler — de verdad, sobre tu piel, durante un mes
            entero — antes de invertir en un frasco completo de 100 ml que
            probablemente cueste lo que un fin de semana fuera de la ciudad.
          </p>
        </section>

        {/* ¿Qué es un decant? */}
        <section className="grid md:grid-cols-2 gap-16 items-center py-20 border-t border-gold-400/10">
          <div>
            <p className="eyebrow mb-5">¿Qué es?</p>
            <h2 className="font-display text-4xl md:text-5xl text-bone mb-6 leading-tight">
              El frasco original, en formato de bolsillo.
            </h2>
            <div className="space-y-5 text-bone/75 leading-relaxed">
              <p>
                Un <strong className="text-gold-400">decant</strong> es una
                porción del perfume original transvasada a un atomizador más
                chico — 5 ml, 10 ml o 30 ml. La fórmula es exactamente la
                misma: el mismo perfume, el mismo concentrado, el mismo lote.
              </p>
              <p>
                Cambia el frasco, no el contenido. Pero al cambiar el frasco,
                cambia todo: el precio, la accesibilidad y, sobre todo, la
                posibilidad de armar tu propio guardarropa olfativo con varias
                fragancias en lugar de quedarte con una sola.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card hairline">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="font-display italic text-2xl text-bone">
                &ldquo;Comprar un frasco a ciegas es lujo;{" "}
                <span className="text-gold-gradient">probar antes es sabiduría.</span>&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Proceso */}
        <section className="py-20 border-t border-gold-400/10">
          <div className="text-center mb-16">
            <p className="eyebrow justify-center mb-4">Cómo trabajamos</p>
            <h2 className="font-display text-4xl md:text-5xl text-bone">
              Nuestro <span className="italic text-gold-gradient">proceso</span>
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

        {/* CTA final */}
        <section className="py-20 text-center border-t border-gold-400/10">
          <p className="eyebrow justify-center mb-6">Próximo paso</p>
          <h2 className="font-display text-4xl md:text-5xl text-bone mb-6">
            ¿Empezamos a armar tu colección?
          </h2>
          <p className="text-bone/70 max-w-xl mx-auto mb-10">
            Contanos qué te gusta — un perfume, un recuerdo, una ocasión — y
            armamos un combo a tu medida.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#catalogo" className="btn-gold">
              Ver catálogo
            </Link>
            <a
              href="https://wa.me/5493834789035?text=Hola%21%20Quiero%20asesor%C3%ADa%20olfativa"
              target="_blank"
              rel="noopener"
              className="btn-outline"
            >
              <span className="material-symbols-outlined text-[16px]">
                chat
              </span>
              Asesoría por WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
