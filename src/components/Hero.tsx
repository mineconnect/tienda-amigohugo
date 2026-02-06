import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
    const scrollToProducts = () => {
        const productsSection = document.getElementById('products-section');
        productsSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black text-white">
            {/* Background with Gradient Overlay */}
            <div
                className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-black to-black"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    <span className="text-xs uppercase tracking-[0.2em] font-medium text-gray-300">Nueva Colección 2026</span>
                </div>

                {/* Main Title */}
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight drop-shadow-2xl">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                        Elegancia
                    </span>
                    <span className="block text-2xl md:text-4xl lg:text-5xl font-light italic mt-2 text-gray-300">
                        que define tu esencia
                    </span>
                </h1>

                <p className="max-w-xl mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-10">
                    Descubre nuestra selección exclusiva de artículos premium. Lujo accesible y distinción para quienes buscan lo extraordinario.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    <button
                        onClick={scrollToProducts}
                        className="group relative px-8 py-4 bg-accent text-white rounded-full font-medium transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Ver Catálogo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    <button className="px-8 py-4 rounded-full font-medium text-white border border-white/20 hover:bg-white/5 hover:border-white/40 transition-all duration-300">
                        Sobre Nosotros
                    </button>
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={scrollToProducts}>
                <ChevronDown size={32} className="text-white" />
            </div>
        </header>
    );
};

export default Hero;
