export default function Footer() {
  return (
    <footer className="bg-background w-full py-16 border-t border-outline-variant/20 mt-24">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="font-headline text-lg text-primary mb-4">VHF Decants</div>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant leading-relaxed">
            © {new Date().getFullYear()} VHF Decants.<br />The Digital Sommelier.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Catálogo", "#catalogo"],
            ["Instagram", "https://instagram.com"],
            ["Contacto", `https://wa.me/5493834789035`],
            ["Inicio", "/"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">
            ¿Consultas?
          </p>
          <a
            href="https://wa.me/5493834789035"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full text-xs text-primary border border-outline-variant/20 hover:border-primary/50 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            Escribinos por WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
