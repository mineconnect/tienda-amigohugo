import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Términos y privacidad — VHF Decants",
  description:
    "Términos y condiciones de uso y política de privacidad de VHF Decants.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-6 md:px-10 max-w-3xl mx-auto">
        <section className="text-center py-16">
          <p className="eyebrow justify-center mb-5">Legal</p>
          <h1 className="font-display text-5xl md:text-6xl font-medium text-bone leading-[1.05] mb-6">
            Términos & <span className="italic text-gold-gradient">Privacidad</span>
          </h1>
          <p className="text-sm text-muted">
            Última actualización · {new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </section>

        <div className="space-y-12">
          <Block title="01 · Sobre VHF Decants">
            <p>
              VHF Decants es un emprendimiento argentino dedicado al
              fraccionado y comercialización de decants de perfumes de lujo,
              100% originales, adquiridos en boutiques oficiales y
              distribuidores autorizados.
            </p>
          </Block>

          <Block title="02 · Producto">
            <p>
              Vendemos porciones (decants) de perfumes originales transvasadas
              en atomizadores nuevos de vidrio. El líquido es idéntico al del
              frasco original; solo cambia el envase. La marca del perfume
              original es propiedad de sus respectivos titulares y se menciona
              al solo efecto descriptivo.
            </p>
          </Block>

          <Block title="03 · Compra y pago">
            <p>
              El pedido se confirma vía WhatsApp tras la selección del cliente
              en el sitio. Aceptamos transferencia bancaria, Mercado Pago y
              efectivo en Pago Fácil / Rapipago. La compra queda confirmada al
              acreditarse el pago.
            </p>
          </Block>

          <Block title="04 · Envíos">
            <p>
              Despachamos a toda Argentina por Andreani y Correo Argentino, en
              24-48 hs hábiles desde la confirmación del pago. El cliente
              recibe código de seguimiento. Los plazos de entrega dependen del
              correo y son estimativos.
            </p>
          </Block>

          <Block title="05 · Cambios y devoluciones">
            <p>
              Por norma de higiene no aceptamos devoluciones por gusto
              personal una vez abierto el decant. Si el producto llega dañado o
              presenta defectos, lo reponemos sin cargo. Productos cerrados y
              sin uso pueden cambiarse dentro de los 10 días.
            </p>
          </Block>

          <Block title="06 · Privacidad de datos">
            <p>
              Solo solicitamos los datos imprescindibles para gestionar tu
              pedido (nombre, dirección y contacto). No los compartimos con
              terceros, no los usamos para publicidad y los conservamos
              únicamente por el plazo necesario para cumplir con obligaciones
              fiscales.
            </p>
          </Block>

          <Block title="07 · Contacto">
            <p>
              Para cualquier consulta legal o comercial podés escribirnos a{" "}
              <a href="mailto:hola@vhfdecants.com" className="text-gold-400 hover:underline">
                hola@vhfdecants.com
              </a>{" "}
              o por WhatsApp al{" "}
              <a href="https://wa.me/5493834789035" className="text-gold-400 hover:underline">
                +54 9 3834 78-9035
              </a>
              .
            </p>
          </Block>
        </div>
      </main>
      <Footer />
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
