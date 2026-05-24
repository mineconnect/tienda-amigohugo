import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Preguntas frecuentes — VHF Decants",
  description:
    "Resolvemos todas tus dudas sobre decants, autenticidad, envíos, pagos y devoluciones.",
};

const SECTIONS = [
  {
    id: "autenticidad",
    title: "Autenticidad",
    items: [
      {
        q: "¿Cómo sé que el perfume es 100% original?",
        a: "Cada decant se fracciona desde el frasco original adquirido en boutiques oficiales o distribuidores autorizados. Conservamos el frasco original y registramos el número de lote. Si querés, te enviamos por WhatsApp la foto del lote y el comprobante de compra antes del despacho.",
      },
      {
        q: "¿Por qué un decant es más barato que un frasco completo?",
        a: "Porque pagás solo el mililitraje que vas a usar. Un frasco de 100 ml de un perfume nicho puede costar $400.000–$700.000. Un decant de 5 ml del mismo perfume puede costar entre $3.000 y $8.000. Misma fórmula, distinto envase.",
      },
      {
        q: "¿Qué pasa si dudo de la fragancia que recibí?",
        a: "Si no coincide con el perfume original, te devolvemos el 100% del dinero o lo cambiamos por otro. La originalidad no se discute: si fallamos, asumimos.",
      },
    ],
  },
  {
    id: "decant",
    title: "El producto",
    items: [
      {
        q: "¿Qué es exactamente un decant?",
        a: "Es una porción del perfume original transvasada a un atomizador más pequeño (5, 10 o 30 ml). El líquido es el mismo perfume, mismo lote y misma fórmula que el frasco oficial — solo cambia el envase.",
      },
      {
        q: "¿Cuántas aplicaciones tiene un decant de 5 ml?",
        a: "Aproximadamente 60 a 80 sprays. Si usás 2 sprays por ocasión y te perfumás día por medio, te dura entre 1 y 2 meses.",
      },
      {
        q: "¿Los atomizadores son nuevos?",
        a: "Sí, siempre. Usamos atomizadores de vidrio óptico nuevos, esterilizados, con válvula de presión fina (no son atomizadores de plástico baratos).",
      },
      {
        q: "¿Cuánto dura un decant ya abierto?",
        a: "Almacenado en lugar fresco y oscuro, conserva sus propiedades 2 a 3 años. Evitá luz directa, baño con humedad y temperaturas extremas.",
      },
    ],
  },
  {
    id: "envios",
    title: "Envíos y pagos",
    items: [
      {
        q: "¿Cuánto tarda el envío?",
        a: "Despachamos en 24-48 hs hábiles desde la confirmación del pago. Andreani al domicilio o sucursal entrega entre 2 y 5 días hábiles según la zona. Correo Argentino, entre 4 y 8 días.",
      },
      {
        q: "¿Cuánto cuesta el envío?",
        a: "Depende del peso y la zona. A CABA y GBA desde $2.500 por Andreani. Al interior, lo cotizamos al momento del pedido. Envío bonificado en compras superiores a $25.000.",
      },
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Transferencia bancaria (recomendado), Mercado Pago (con todas las tarjetas y cuotas según promo vigente) y efectivo en Pago Fácil o Rapipago.",
      },
      {
        q: "¿Hacen envíos al exterior?",
        a: "Por el momento solo Argentina. Estamos trabajando para habilitar Uruguay, Chile y Paraguay.",
      },
    ],
  },
  {
    id: "devoluciones",
    title: "Cambios y devoluciones",
    items: [
      {
        q: "¿Puedo devolver un decant si no me gusta?",
        a: "Por norma de higiene y autenticidad no aceptamos devoluciones por gusto personal una vez abierto. Si el producto está cerrado y sin uso, aceptamos cambios dentro de los 10 días.",
      },
      {
        q: "¿Y si el producto llega dañado?",
        a: "Te lo reponemos sin cargo. Pedimos foto del paquete y del decant al recibirlo para gestionar el reclamo con el correo.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-6 md:px-10 max-w-5xl mx-auto">
        {/* Hero */}
        <section className="text-center py-16 md:py-24">
          <p className="eyebrow justify-center mb-5">Soporte</p>
          <h1 className="font-display text-5xl md:text-7xl font-medium text-bone leading-[1.05] mb-6 text-balance">
            Preguntas <span className="italic text-gold-gradient">frecuentes</span>
          </h1>
          <p className="text-lg text-bone/70 max-w-2xl mx-auto leading-relaxed">
            Todo lo que necesitás saber sobre decants, autenticidad, envíos y
            pagos. ¿Algo no está acá? Escribinos por WhatsApp.
          </p>
        </section>

        {/* Índice rápido */}
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

        {/* Secciones */}
        <div className="space-y-20">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display italic text-4xl text-gold-gradient">
                  {String(SECTIONS.indexOf(section) + 1).padStart(2, "0")}
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

        {/* CTA final */}
        <section className="mt-24 text-center glass-card hairline rounded-3xl p-12">
          <p className="eyebrow justify-center mb-5">¿Seguís con dudas?</p>
          <h3 className="font-display text-3xl md:text-4xl text-bone mb-4">
            Hablemos directo
          </h3>
          <p className="text-sm text-muted max-w-md mx-auto mb-8">
            Te respondemos en minutos durante el día. Sin bots, sin formularios
            eternos.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/5493834789035?text=Hola%21%20Tengo%20una%20consulta"
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
      <Footer />
    </>
  );
}
