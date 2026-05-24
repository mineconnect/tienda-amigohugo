import Link from "next/link";

const COL_EXPLORE = [
  { label: "Catálogo completo",     href: "/#catalogo" },
  { label: "Niche",                 href: "/?categoria=Niche#catalogo" },
  { label: "Designer",              href: "/?categoria=Designer#catalogo" },
  { label: "Árabes",                href: "/?categoria=Árabes#catalogo" },
];

const COL_HELP = [
  { label: "¿Qué es un decant?",    href: "/sobre-nosotros" },
  { label: "Preguntas frecuentes",  href: "/faq" },
  { label: "Envíos y pagos",        href: "/faq#envios" },
  { label: "Autenticidad",          href: "/faq#autenticidad" },
];

const COL_BRAND = [
  { label: "Sobre nosotros",        href: "/sobre-nosotros" },
  { label: "Asesoría olfativa",     href: "https://wa.me/5493834789035", external: true },
  { label: "Instagram",             href: "https://instagram.com/vhfdecants", external: true },
  { label: "Términos y privacidad", href: "/terminos" },
];

export default function Footer() {
  return (
    <footer className="relative bg-ink-950 border-t border-gold-400/15 mt-12">
      {/* Strip dorado superior */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
        {/* Marca + tagline */}
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display italic text-4xl text-gold-gradient leading-none">
                V
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-bone leading-none">
                  VHF Decants
                </h3>
                <p className="text-[10px] uppercase tracking-ultra text-gold-400/80 mt-1">
                  Atelier · Buenos Aires
                </p>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-md">
              Fraccionamos los perfumes más codiciados del mundo para que los
              probás antes de invertir en un frasco completo. 100% originales,
              fraccionados a mano.
            </p>
            <div className="flex gap-3 mt-8">
              <a
                href="https://wa.me/5493834789035"
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
                href="https://instagram.com/vhfdecants"
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
                href="mailto:hola@vhfdecants.com"
                aria-label="Email"
                className="w-10 h-10 rounded-full border border-gold-400/30 flex items-center justify-center text-gold-400 hover:bg-gold-400 hover:text-ink-950 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  mail
                </span>
              </a>
            </div>
          </div>

          {/* Columnas */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 mb-5 font-semibold">
                Explorar
              </h4>
              <ul className="space-y-3">
                {COL_EXPLORE.map((i) => (
                  <li key={i.label}>
                    <Link
                      href={i.href}
                      className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                    >
                      {i.label}
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
                {COL_HELP.map((i) => (
                  <li key={i.label}>
                    <Link
                      href={i.href}
                      className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 mb-5 font-semibold">
                Casa
              </h4>
              <ul className="space-y-3">
                {COL_BRAND.map((i) => (
                  <li key={i.label}>
                    {i.external ? (
                      <a
                        href={i.href}
                        target="_blank"
                        rel="noopener"
                        className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                      >
                        {i.label}
                      </a>
                    ) : (
                      <Link
                        href={i.href}
                        className="text-sm text-bone/70 hover:text-gold-400 transition-colors"
                      >
                        {i.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="pt-8 border-t border-gold-400/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} VHF Decants — Todos los derechos
            reservados.
          </p>
          <p className="text-[10px] uppercase tracking-widest text-muted">
            Diseñado con · obsesión por el detalle
          </p>
        </div>
      </div>
    </footer>
  );
}
