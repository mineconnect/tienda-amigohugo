import React from 'react';
import { Instagram, MessageCircle, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="flex items-center gap-4">
                            <img src="/logo.jpeg" alt="VHF Logo" className="h-16 w-auto rounded-lg opacity-90 border border-white/10" />
                            <div>
                                <h2 className="font-serif text-2xl font-bold tracking-wide">VHF_Decants</h2>
                                <p className="text-accent text-xs uppercase tracking-[0.3em]">Luxury Fragrances</p>
                            </div>
                        </div>
                        <p className="text-gray-400 font-light leading-relaxed max-w-sm">
                            Descubre la esencia del lujo a través de nuestra selección curada de decants exclusivos. Cada gota cuenta una historia.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Instagram, href: "#" },
                                { icon: MessageCircle, href: "#" },
                                { icon: Mail, href: "#" }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent border border-white/10 hover:border-accent flex items-center justify-center transition-all duration-300 group"
                                >
                                    <social.icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-sans font-bold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
                            <span className="w-1 h-4 bg-accent rounded-full"></span> Explorar
                        </h3>
                        <ul className="space-y-4 text-gray-400 font-light text-sm">
                            {['Nueva Colección', 'Best Sellers', 'Sobre Nosotros', 'FAQ'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-accent hover:pl-2 transition-all duration-300 block">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-sans font-bold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
                            <span className="w-1 h-4 bg-accent rounded-full"></span> Contacto
                        </h3>
                        <ul className="space-y-4 text-gray-400 font-light text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="mt-1 text-accent" />
                                <span>Buenos Aires, Argentina<br />Envíos a todo el país</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageCircle size={16} className="text-accent" />
                                <span>+54 9 11 2345-6789</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-medium">
                    <p>&copy; {new Date().getFullYear()} VHF_Decants. Todos los derechos reservados.</p>
                    <div className="flex gap-6 items-center">
                        <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacidad</span>
                        <span className="hover:text-gray-400 cursor-pointer transition-colors">Términos</span>
                        <a href="/login" className="text-gray-800 hover:text-gray-600 transition-colors text-[10px] uppercase tracking-widest border border-gray-800 px-2 py-1 rounded hover:border-gray-600">
                            Admin Access
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
