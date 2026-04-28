"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CartItem,
  getCart,
  removeFromCart,
  updateQuantity,
  cartTotal,
  buildWhatsAppMessage,
} from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getCart());
  }, []);

  const handleRemove = (id: string) => {
    setItems(removeFromCart(id));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleQty = (id: string, qty: number) => {
    setItems(updateQuantity(id, qty));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    window.open(buildWhatsAppMessage(items), "_blank");
  };

  if (!mounted) return null;

  const total = cartTotal(items);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto min-h-screen">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver al catálogo
          </Link>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-background mb-2">
            Tu Carrito
          </h1>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">
            Selección Exclusiva de Artículos
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-30 mb-4 block">
              shopping_bag
            </span>
            <p className="text-on-surface-variant text-sm uppercase tracking-widest mb-8">
              Tu carrito está vacío
            </p>
            <Link
              href="/#catalogo"
              className="inline-flex items-center gap-2 bg-primary text-on-primary-fixed font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-primary-dim transition-colors"
            >
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items */}
            <div className="lg:col-span-8 space-y-10">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-6 items-start pb-8 border-b border-outline-variant/20"
                >
                  {/* Image */}
                  <div className="w-full sm:w-36 aspect-[3/4] rounded-xl overflow-hidden bg-surface-container flex-shrink-0 relative">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-30">spa</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-headline text-xl font-bold text-on-surface">{item.name}</h3>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors ml-4"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                    {item.size && (
                      <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-4">
                        {item.size}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-6">
                      {/* Qty */}
                      <div className="flex items-center space-x-4 bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/20">
                        <button
                          onClick={() => handleQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQty(item.id, item.quantity + 1)}
                          className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      <span className="font-headline text-lg font-bold text-primary">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-4">
              <div className="glass-card luminous-shadow rounded-2xl p-8 sticky top-28 border border-outline-variant/10">
                <h2 className="font-headline text-xl font-bold text-on-surface mb-8">Resumen</h2>
                <div className="space-y-3 mb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-on-surface-variant">
                      <span className="truncate max-w-[140px]">{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toLocaleString("es-AR")}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span className="font-headline text-base font-bold">Total</span>
                    <span className="font-headline text-2xl font-bold text-primary">
                      ${total.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>

                {/* WhatsApp checkout button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-100 bg-[#25D366] text-white hover:bg-[#1db954]"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Comprar por WhatsApp
                </button>

                <p className="text-center text-[10px] uppercase tracking-widest text-on-surface-variant mt-4">
                  Te llevará a WhatsApp con tu pedido listo
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
