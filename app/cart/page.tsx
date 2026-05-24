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
      <main className="pt-28 pb-24 px-6 md:px-10 max-w-[1400px] mx-auto min-h-screen">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted hover:text-gold-400 transition-colors mb-6"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            Volver al catálogo
          </Link>
          <p className="eyebrow mb-4">Carrito</p>
          <h1 className="font-display text-5xl md:text-6xl font-medium text-bone mb-3">
            Tu <span className="italic text-gold-gradient">selección</span>
          </h1>
          <p className="text-sm text-muted uppercase tracking-widest">
            {items.length === 0
              ? "Sin artículos"
              : `${items.length} ${items.length === 1 ? "fragancia" : "fragancias"}`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32 glass-card hairline rounded-3xl">
            <span className="material-symbols-outlined text-7xl text-gold-400/30 mb-6 block">
              shopping_bag
            </span>
            <p className="text-sm uppercase tracking-widest text-muted mb-8">
              Tu carrito está vacío
            </p>
            <Link href="/#catalogo" className="btn-gold">
              Ver catálogo
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Items */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="glass-card hairline rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-start"
                >
                  {/* Imagen */}
                  <div className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-ink-700 flex-shrink-0 relative">
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
                        <span className="material-symbols-outlined text-3xl text-gold-400/30">
                          local_florist
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Detalles */}
                  <div className="flex-grow w-full">
                    <div className="flex justify-between items-start mb-1 gap-4">
                      <div>
                        <h3 className="font-display text-xl text-bone leading-tight">
                          {item.name}
                        </h3>
                        {item.size && (
                          <p className="text-[10px] uppercase tracking-widest text-muted mt-1">
                            Tamaño · {item.size}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-muted hover:text-error transition-colors"
                        aria-label="Eliminar"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-5">
                      {/* Cantidad */}
                      <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-gold-400/25 bg-ink-900/40">
                        <button
                          onClick={() => handleQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-gold-400 hover:text-gold-300 disabled:opacity-30"
                          aria-label="Restar"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            remove
                          </span>
                        </button>
                        <span className="font-display text-base text-bone w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQty(item.id, item.quantity + 1)}
                          className="text-gold-400 hover:text-gold-300"
                          aria-label="Sumar"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                        </button>
                      </div>
                      <span className="font-display text-2xl text-gold-gradient">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="lg:col-span-4">
              <div className="glass-card hairline rounded-3xl p-8 sticky top-28">
                <p className="eyebrow mb-4">Resumen</p>
                <h2 className="font-display text-2xl text-bone mb-6">
                  Tu pedido
                </h2>

                <div className="space-y-3 mb-8 pb-8 border-b border-gold-400/15">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-xs text-muted gap-3"
                    >
                      <span className="truncate flex-1">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="flex-shrink-0">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-[10px] uppercase tracking-widest text-muted">
                    Total
                  </span>
                  <span className="font-display text-4xl text-gold-gradient leading-none">
                    ${total.toLocaleString("es-AR")}
                  </span>
                </div>

                {/* WhatsApp checkout */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-full font-body font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-100 bg-[#25D366] text-white hover:bg-[#1db954] shadow-[0_18px_30px_-12px_rgba(37,211,102,0.4)]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Finalizar por WhatsApp
                </button>

                <p className="text-center text-[10px] uppercase tracking-widest text-muted mt-5">
                  Te abrimos WhatsApp con tu pedido pre-armado
                </p>

                {/* Garantías */}
                <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-gold-400/10">
                  {[
                    { icon: "verified", lbl: "Original" },
                    { icon: "local_shipping", lbl: "24-48h" },
                    { icon: "lock", lbl: "Seguro" },
                  ].map((g) => (
                    <div
                      key={g.lbl}
                      className="flex flex-col items-center text-center"
                    >
                      <span className="material-symbols-outlined text-gold-400 text-[18px] mb-1">
                        {g.icon}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-muted">
                        {g.lbl}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
