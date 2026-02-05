import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import type { Producto } from '../types';

interface ProductGridProps {
    products: Producto[];
    loading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
    const WHATSAPP_NUMBER = "5491123456789";

    const getWhatsAppLink = (productName: string) => {
        const message = `Hola VHF Decants, me interesa: ${productName}`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent">
                        <ShoppingBag size={20} />
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="inline-flex p-6 bg-gray-50 rounded-full mb-6">
                    <ShoppingBag size={48} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">Catálogo Vacío</h3>
                <p className="text-gray-400 max-w-md mx-auto">Aún no hemos cargado nuestros productos exclusivos. Vuelve pronto.</p>
            </div>
        );
    }

    return (
        <div id="products-section" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Nuestra Selección</h2>
                        <p className="text-gray-500 font-light text-lg">Fragancias curadas para gustos exigentes.</p>
                    </div>
                    <div className="text-sm font-medium text-gray-500 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 uppercase tracking-wider">
                        {products.length} Artículos Exclusivos
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {products.map((product) => (
                        <div key={product.id} className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col">

                            {/* Image Container */}
                            <div className="relative aspect-[4/5] bg-gray-100 rounded-[1.5rem] overflow-hidden mb-6">
                                {product.imagen_url ? (
                                    <img
                                        src={product.imagen_url}
                                        alt={product.nombre}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                        <ShoppingBag size={32} />
                                    </div>
                                )}

                                {/* Badge */}
                                {product.categoria && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur text-black text-[10px] uppercase font-bold px-3 py-1.5 rounded-full shadow-sm tracking-widest border border-gray-100">
                                            {product.categoria}
                                        </span>
                                    </div>
                                )}

                                {/* Quick Action Overlay */}
                                <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
                                    <a
                                        href={getWhatsAppLink(product.nombre)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-white/95 backdrop-blur text-primary text-center py-3 rounded-full font-bold text-sm shadow-lg hover:bg-primary hover:text-white transition-colors"
                                    >
                                        Consultar Precio
                                    </a>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="px-2 flex flex-col flex-grow">
                                <h3 className="font-serif text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors leading-tight">
                                    {product.nombre}
                                </h3>
                                <p className="text-gray-500 text-sm font-light mb-4 line-clamp-2 leading-relaxed">
                                    {product.descripcion}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xl font-bold text-primary tracking-tight">
                                        {formatCurrency(product.precio)}
                                    </span>
                                    <a
                                        href={getWhatsAppLink(product.nombre)}
                                        className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-accent transition-colors duration-300"
                                    >
                                        <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                    </a>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductGrid;
