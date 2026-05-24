"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import { useState } from "react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const notes = (product.notes || []).slice(0, 3);

  return (
    <Link
      href={`/producto/${product.id}`}
      className="product-card group block glass-card hairline rounded-2xl overflow-hidden"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-ink-700 to-ink-900">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-gold-400/20">
              local_florist
            </span>
          </div>
        )}

        {/* Gradiente bottom para legibilidad */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent" />

        {/* Badge categoría / size */}
        {product.size && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-ink-950/70 backdrop-blur-sm rounded-full text-[9px] font-medium uppercase tracking-widest text-gold-300 border border-gold-400/20">
            {product.size}
          </div>
        )}

        {/* Agotado */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-bone/80 border border-bone/30 px-4 py-2 rounded-full">
              Agotado
            </span>
          </div>
        )}

        {/* Botón Agregar — desktop overlay, mobile siempre visible */}
        <button
          onClick={handleAdd}
          disabled={!product.in_stock}
          className={`absolute bottom-3 right-3 z-10 h-10 w-10 rounded-full flex items-center justify-center
            transition-all duration-500
            ${added ? "bg-gold-400 text-ink-950 scale-110" : "bg-ink-950/80 backdrop-blur-md text-gold-400 border border-gold-400/40 hover:bg-gold-400 hover:text-ink-950"}
            disabled:opacity-30 disabled:cursor-not-allowed`}
          aria-label="Agregar al carrito"
        >
          <span className="material-symbols-outlined text-[18px]">
            {added ? "check" : "add"}
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-bone leading-tight truncate">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-[10px] uppercase tracking-widest text-muted mt-0.5">
              {product.category}
            </p>
          )}
        </div>

        {notes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {notes.map((n) => (
              <span key={n} className="note-tag">
                {n}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between pt-2 border-t border-gold-400/10">
          <span className="font-display text-2xl font-semibold text-gold-gradient">
            ${product.price.toLocaleString("es-AR")}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted">
            Ver detalle
            <span className="material-symbols-outlined text-[12px] align-middle ml-0.5">
              arrow_forward
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
