import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';

interface HeaderProps {
    cartCount?: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount = 0 }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                        ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-3 shadow-xl'
                        : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center">

                        {/* Logo Section - PRESERVED EXACTLY */}
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                                <img
                                    src="/logo.jpeg"
                                    alt="VHF Logo"
                                    className="relative h-14 w-auto rounded-lg border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-white font-serif text-2xl font-bold tracking-wider">VHF_Decants</h1>
                                <p className="text-[10px] text-accent uppercase tracking-[0.3em] font-semibold opacity-90">Exclusividad & Estilo</p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-10">
                            {['Colección', 'Novedades', 'Exclusivos'].map((item) => (
                                <span
                                    key={item}
                                    className="text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:tracking-widest font-medium text-xs uppercase relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-6">
                            <button className="text-white/70 hover:text-white transition-colors hidden sm:block">
                                <Search size={20} className="w-5 h-5" />
                            </button>

                            <button className="relative group">
                                <div className="bg-white/5 hover:bg-accent text-white p-2.5 rounded-full transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                                    <ShoppingBag size={20} strokeWidth={1.5} />
                                </div>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <button
                                className="md:hidden text-white/80 hover:text-white transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-500 md:hidden flex items-center justify-center ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center gap-8 text-center">
                    {['Colección', 'Novedades', 'Exclusivos', 'Contacto'].map((item, idx) => (
                        <span
                            key={item}
                            className="text-2xl font-serif text-white hover:text-accent transition-colors cursor-pointer"
                            style={{ transitionDelay: `${idx * 100}ms` }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Header;
