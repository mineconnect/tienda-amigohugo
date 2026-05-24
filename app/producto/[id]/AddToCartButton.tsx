"use client";
import { useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/lib/supabase";

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        size: product.size,
      });
    }
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
      {/* Selector cantidad */}
      <div className="flex items-center justify-between gap-4 px-5 py-3 rounded-full border border-gold-400/30 bg-ink-900/40 backdrop-blur-sm">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="text-gold-400 hover:text-gold-300 disabled:opacity-30"
          disabled={qty <= 1}
          aria-label="Restar"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
        <span className="font-display text-lg text-bone w-6 text-center">
          {qty}
        </span>
        <button
          onClick={() => setQty(qty + 1)}
          className="text-gold-400 hover:text-gold-300"
          aria-label="Sumar"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={!product.in_stock}
        className="btn-gold flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {added ? (
          <>
            <span className="material-symbols-outlined text-[16px]">check</span>
            Agregado
          </>
        ) : product.in_stock ? (
          <>
            <span className="material-symbols-outlined text-[16px]">
              shopping_bag
            </span>
            Agregar al carrito
          </>
        ) : (
          "Sin stock"
        )}
      </button>

      <Link href="/cart" className="btn-outline">
        Ver carrito
      </Link>
    </div>
  );
}
