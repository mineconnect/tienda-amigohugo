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
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="aspect-[3/4] rounded-xl bg-surface-container overflow-hidden mb-4 relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-variant">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-30">
              spa
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button
            onClick={handleAdd}
            className="w-full bg-primary text-on-primary-fixed py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary-dim transition-colors"
          >
            {added ? "✓ Agregado" : "Agregar al carrito"}
          </button>
        </div>

        {/* Out of stock badge */}
        {!product.in_stock && (
          <div className="absolute top-3 left-3 bg-error/90 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
            Sin stock
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="font-headline font-bold text-sm text-on-surface leading-tight">
          {product.name}
        </h3>
        {product.size && (
          <p className="text-xs text-on-surface-variant uppercase tracking-wider">{product.size}</p>
        )}
        {product.notes && product.notes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.notes.slice(0, 3).map((note) => (
              <span
                key={note}
                className="bg-surface-container-highest px-2 py-0.5 rounded-full text-[9px] font-bold text-primary uppercase tracking-tighter"
              >
                {note}
              </span>
            ))}
          </div>
        )}
        <p className="font-headline text-base font-bold text-primary mt-2">
          ${product.price.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}
