import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/settings";
import { createPublicClient } from "@/lib/publicSupabase";
import type { Category } from "@/lib/supabase";

export const metadata = {
  title: "Términos y privacidad — VHF Importaciones de Belén",
  description: "Términos de uso y política de privacidad de VHF.",
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

export default async function TermsPage() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);

  return (
    <>
      <Navbar categories={categories} />
      <main className="pt-28 pb-24 px-6 md:px-10 max-w-3xl mx-auto">
        <section className="text-center py-16">
          <p className="eyebrow justify-center mb-5">Legal</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-bone leading-[1.05] mb-6">
            Términos &{" "}
            <span className="italic text-gold-gradient">Privacidad</span>
          </h1>
          <p className="text-sm text-muted">
            Última actualización ·{" "}
            {new Date().toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </section>

        <div className="space-y-12">
          <Block title="01 · Sobre la tienda">
            <p>
              VHF Decants es una tienda online con sede en Belén (Catamarca, Argentina). Comercializa ropa, calzado, bazar, hogar, accesorios y tecnología.
            </p>
          </Block>

          <Block title="02 · Productos">
            <p>
              Las fotos y descripciones son representativas; pueden existir leves variaciones de color por iluminación. Si tenés dudas sobre algún producto, consultanos por WhatsApp antes de comprar.
            </p>
          </Block>

          <Block title="03 · Cómo se compra">
            <p>
              La compra se inicia agregando productos al carrito en este sitio. Al finalizar, el sistema abre WhatsApp con el pedido pre-armado. Una vez confirmado el pedido por mensaje, se coordina el pago y el envío. El sitio no procesa pagos automáticos.
            </p>
          </Block>

          <Block title="04 · Pagos">
            <p>
              Aceptamos transferencia bancaria, Mercado Pago y efectivo (solo si se retira en Belén). El pedido queda reservado por 48 hs hasta la confirmación del pago; pasado ese plazo, se libera el stock.
            </p>
          </Block>

          <Block title="05 · Envíos">
            <p>
              Despachamos a toda Argentina por correo o encomienda con código de seguimiento. Los plazos dependen del destino (3-12 días hábiles). El costo de envío se cotiza al confirmar el pedido y lo paga el comprador al correo, salvo promoción vigente.
            </p>
          </Block>

          <Block title="06 · Cambios y devoluciones">
            <p>
              Tenés 7 días desde la recepción para solicitar un cambio o devolución, siempre que el producto esté sin uso, con sus etiquetas originales y en condiciones de reventa. Los costos de envío de cambio son por cuenta del comprador, salvo que el producto haya tenido un defecto de fábrica.
            </p>
          </Block>

          <Block title="07 · Privacidad de datos">
            <p>
              Solo solicitamos los datos imprescindibles para gestionar tu pedido (nombre, dirección, contacto). No los compartimos con terceros, no los usamos para publicidad y los conservamos únicamente por el plazo necesario para cumplir con obligaciones fiscales.
            </p>
          </Block>

          <Block title="08 · Contacto">
            <p>
              Para cualquier consulta podés escribirnos por WhatsApp al{" "}
              <a
                href={`https://wa.me/${settings.contact_whatsapp || "5493834789035"}`}
                className="text-gold-400 hover:underline"
              >
                {settings.contact_whatsapp_display || "+54 9 3834 78-9035"}
              </a>{" "}
              o por mail a{" "}
              <a
                href={`mailto:${settings.contact_email || "hola@vhfbelen.com.ar"}`}
                className="text-gold-400 hover:underline"
              >
                {settings.contact_email || "hola@vhfbelen.com.ar"}
              </a>
              .
            </p>
          </Block>
        </div>
      </main>
      <Footer categories={categories} settings={settings} />
    </>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl text-bone mb-4">
        {title}
      </h2>
      <div className="text-bone/75 leading-relaxed">{children}</div>
    </div>
  );
}
