import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import type { Producto } from '../types';
import { ShoppingBag, Star, MessageCircle, ArrowRight, Smartphone, Shirt, Watch } from 'lucide-react';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const WHATSAPP_NUMBER = "5491123456789"; 

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos') 
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getWhatsAppLink = (productName: string) => {
    const message = `Hola VHF Decants, me interesa: ${productName}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="bg-[#f8f9fa] font-sans text-gray-800 min-h-screen relative selection:bg-[#d946ef] selection:text-white">
      
      {/* --- MARCA DE AGUA FIJA (Parallax) --- */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.06] pointer-events-none mix-blend-multiply"
        style={{
            backgroundImage: "url('/logo.jpeg')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: '500px auto', 
            backgroundPosition: 'center center'
        }}
      ></div>

      {/* --- Contenido Principal --- */}
      <div className="relative z-10">
        
        {/* Navbar Premium */}
        <nav className="bg-[#0a0a0a]/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800 shadow-2xl transition-all duration-300">
          <div className="container mx-auto px-6 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src="/logo.jpeg" alt="VHF Logo" className="h-14 w-auto rounded-lg border border-gray-600 shadow-[0_0_15px_rgba(217,70,239,0.3)]" />
                <div className="hidden sm:block">
                  <h1 className="text-white font-serif text-2xl font-bold tracking-wider">VHF_Decants</h1>
                  <p className="text-[10px] text-[#d946ef] uppercase tracking-[0.3em] font-semibold">Exclusividad & Estilo</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                {['Tecnología', 'Moda', 'Accesorios'].map((item) => (
                  <span key={item} className="hidden md:block text-gray-400 hover:text-white cursor-pointer transition-all hover:tracking-widest font-medium text-xs uppercase">
                    {item}
                  </span>
                ))}
                <button className="bg-white/10 hover:bg-[#d946ef] text-white p-2 rounded-full transition-colors">
                    <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section de Lujo */}
        <header className="bg-[#0a0a0a] text-white relative overflow-hidden pb-16 pt-24 border-b border-[#d946ef]/30">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#d946ef]/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-[#d946ef]/10 border border-[#d946ef]/30 text-[#d946ef] text-xs font-bold tracking-widest uppercase mb-6 animate-pulse">
                Nueva Colección 2026
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Calidad y Estilo <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] via-purple-300 to-[#d946ef]">
                Sin Límites
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-light mb-10">
              Bienvenido al destino definitivo del lujo. Descubre nuestra colección donde cada detalle cuenta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                 Ver Catálogo
               </button>
               <button className="px-8 py-4 rounded-full font-bold text-white border border-white/30 hover:bg-white/10 transition-all">
                 Contactar
               </button>
            </div>
          </div>
        </header>

        {/* Sección de Categorías Visuales (Decorativa) */}
        <section className="bg-white py-12 border-b border-gray-100">
             <div className="container mx-auto px-6">
                 <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
                     {[
                         { icon: Smartphone, label: "Tecnología" },
                         { icon: Shirt, label: "Moda" },
                         { icon: Watch, label: "Accesorios" }
                     ].map((cat, idx) => (
                         <div key={idx} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                             <cat.icon size={32} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#d946ef] transition-colors mb-3" />
                             <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">{cat.label}</span>
                         </div>
                     ))}
                 </div>
             </div>
        </section>

        {/* Catálogo de Productos */}
        <main className="container mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-serif text-4xl font-bold text-[#0a0a0a]">Nuestra Selección</h2>
                <div className="h-1 w-20 bg-[#d946ef] mt-4 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                  {products.length} Artículos Disponibles
              </span>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d946ef]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col relative">
                  
                  {/* Imagen del Producto */}
                  <div className="relative h-72 bg-[#f4f4f5] overflow-hidden flex items-center justify-center">
                    {product.imagen_url ? (
                      <img 
                          src={product.imagen_url} 
                          alt={product.nombre} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <ShoppingBag size={48} className="text-gray-300" strokeWidth={1} />
                    )}
                    
                    {/* Overlay al pasar mouse */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                    {product.categoria && (
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black text-[10px] px-3 py-1.5 rounded-full uppercase font-bold tracking-wider shadow-sm border border-gray-100">
                          {product.categoria}
                        </span>
                    )}
                  </div>
                  
                  {/* Información */}
                  <div className="p-6 flex flex-col flex-grow relative">
                    <h3 className="font-serif text-xl font-bold text-[#0a0a0a] mb-2 leading-tight group-hover:text-[#d946ef] transition-colors">{product.nombre}</h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed font-light">{product.descripcion}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div>
                           <span className="font-bold text-2xl text-[#0a0a0a]">
                            {formatCurrency(product.precio)}
                           </span>
                        </div>

                        <a 
                            href={getWhatsAppLink(product.nombre)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#0a0a0a] hover:bg-[#d946ef] text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#d946ef]/50 flex items-center justify-center group/btn"
                        >
                            <ArrowRight size={20} className="group-hover/btn:-rotate-45 transition-transform" />
                        </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && products.length === 0 && (
              <div className="text-center py-20">
                  <p className="text-gray-400">Aún no hay productos cargados.</p>
                  <p className="text-sm text-gray-300 mt-2">Usa el botón "Admin" abajo a la derecha para agregar.</p>
              </div>
          )}
        </main>

         {/* Footer de Lujo */}
         <footer className="bg-[#0a0a0a] text-white py-20 border-t border-gray-900 relative z-10 overflow-hidden">
           {/* Decoración de fondo footer */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#d946ef] to-transparent opacity-50"></div>
           
          <div className="container mx-auto px-6 flex flex-col items-center relative">
            <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <img src="/logo.jpeg" alt="VHF Logo" className="h-24 w-auto rounded-lg opacity-90" />
            </div>
            
            <p className="font-serif text-3xl font-bold mb-3 tracking-wide">VHF_Decants</p>
            <p className="text-[#d946ef] text-sm uppercase tracking-[0.4em] mb-10">El arte del buen gusto</p>
            
            <div className="flex gap-8 mb-12">
               {/* Iconos sociales simulados */}
              <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"><Star size={18}/></div>
              <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"><ShoppingBag size={18}/></div>
              <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"><MessageCircle size={18}/></div>
            </div>

            <p className="text-xs text-gray-600 font-medium">© {new Date().getFullYear()} VHF_Decants. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;