import Link from "next/link";
import type { Category } from "@/lib/supabase";
import type { Settings } from "@/lib/supabase";

interface Props {
  categories?: Category[];
  settings?: Settings;
}

export default function Footer({ categories = [], settings = {} }: Props) {
  const whatsapp = settings.contact_whatsapp || "5493834789035";
  const whatsappDisplay = settings.contact_whatsapp_display || "+54 9 3834 78-9035";
  const city = settings.contact_city || "Belén, Catamarca";
  const instagram = settings.contact_instagram || "vhf_belen";
  const email = settings.contact_email || "hola@vhfbelen.com.ar";

  return (
    <footer className="relative bg-ink-950 border-t border-gold-400/15 mt-12">
      <div className="h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display italic text-4xl text-gold-gradient leading-none">
                V
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-bone leading-none">
                  VHF
                </h3>
                <p className="text-[10px] uppercase tracking-ultra text-gold-400/80 mt-1">
                  {city}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-md">
              Productos elegidos uno por uno por Víctor Hugo Figueroa. Ropa, calzado, bazar, hogar — buenos, lindos y a precio justo.
            </p>
            <div className="flex gap-3 mt-8">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full border border-gold-400/30 flex items-center justify-center text-gold-400 hover:bg-gold-400 hover:text-ink-950 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chat
                </span>
              </a>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-gold-400/30 flex items-center justify-center text-gold-400 hover:bg-gold-400 hover:text-ink-950 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  photo_camera
                </span>
              </a>
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                className="w-10 h-10 rounded-full border border-gold-400/30 flex items-center justify-center text-gold-400 hover:bg-gold-400 hover:text-ink-950 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  mail
                </span>
              </a>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 mb-5 font-semibold">
                Comprar
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/#catalogo"
                    className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                  >
                    Catálogo completo
                  </Link>
                </li>
                {categories.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/?categoria=${c.slug}#catalogo`}
                      className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 mb-5 font-semibold">
                Ayuda
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                  >
                    Preguntas frecuentes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq#envios"
                    className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                  >
                    Envíos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq#pagos"
                    className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                  >
                    Formas de pago
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terminos"
                    className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                  >
                    Términos y privacidad
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 mb-5 font-semibold">
                Casa
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/sobre-nosotros"
                    className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                  >
                    Sobre Víctor Hugo
                  </Link>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener"
                    className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                  >
                    {whatsappDisplay}
                  </a>
                </li>
                <li>
                  <span className="text-sm text-bone/70">{city}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gold-400/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} VHF · Víctor Hugo Figueroa — Todos los derechos reservados.
          </p>
          <p className="text-[10px] uppercase tracking-widest text-muted">
            Hecho con · cariño desde Belén
          </p>
        </div>
      </div>
    </footer>
  );
}
