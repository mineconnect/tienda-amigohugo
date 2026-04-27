export default function Footer() {
  return (
    <footer className="bg-background w-full py-16 border-t border-outline-variant/20 mt-24">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
        <div className="flex flex-col justify-end">
          <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
            © {new Date().getFullYear()} VHF_Decants.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 md:text-center text-left">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white mb-4 font-bold">EXPLORAR</h4>
            <div className="flex flex-col space-y-2">
              {["Colecciones", "Fragancias", "Notas de Casa", "Trending", "Sets"].map((label) => (
                <a key={label} href="#catalogo" className="text-xs text-gray-400 hover:text-white transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white mb-4 font-bold">CONTACTO</h4>
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Sobre Nosotros</a>
              <a href="https://wa.me/5493834789035" className="text-xs text-gray-400 hover:text-white transition-colors">WhatsApp</a>
              <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Términos</a>
              <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Privacidad</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
