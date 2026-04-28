"use client";
import Image from "next/image";
import { Product } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import { useState } from "react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      size: product.size,
    });
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group cursor-pointer glass-card luminous-shadow rounded-xl overflow-hidden">
      {/* Image */}
      <div className="aspect-[4/5] rounded-xl bg-transparent overflow-hidden mb-4 relative flex items-center justify-center p-4">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply p-4"
            sizes="(max-width: 768px) 100vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-black/20">
              spa
            </span>
          </div>
        )}

        {/* Hover overlay with button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
          <button
            onClick={handleAdd}
            className="bg-white text-black py-2 px-6 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            {added ? "✓ Agregado" : "Agregar"}
          </button>
        </div>

        {/* Out of stock badge */}
        {!product.in_stock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
            Sold Out
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="font-body font-bold text-sm text-gray-200 leading-tight">
          {product.name}
        </h3>
        {product.size && (
          <p className="text-xs text-gray-400 uppercase tracking-wider">{product.size}</p>
        )}
        <p className="font-body text-sm font-bold text-gray-100 mt-2">
          ${product.price.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}
