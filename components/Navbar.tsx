"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, CartItem } from "@/lib/cart";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const items: CartItem[] = getCart();
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
    };
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-6 md:px-8 h-20 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="font-headline text-2xl font-bold tracking-tighter text-primary">
          VHF Decants
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-8 items-center">
          {["Colecciones", "Fragancias", "Notas de Casa", "Sets Descubrimiento"].map((item) => (
            <a
              key={item}
              href="#catalogo"
              className="font-headline uppercase tracking-widest text-xs text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-5">
          <a href="#catalogo" className="hover:scale-110 transition-transform text-primary hidden md:block">
            <span className="material-symbols-outlined">search</span>
          </a>
          <Link href="/cart" className="hover:scale-110 transition-transform text-primary relative">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary-fixed text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {/* Hamburger */}
          <button
            className="md:hidden text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-container border-t border-outline-variant/20 px-6 py-4 space-y-3">
          {["Colecciones", "Fragancias", "Notas de Casa", "Sets Descubrimiento"].map((item) => (
            <a
              key={item}
              href="#catalogo"
              onClick={() => setMenuOpen(false)}
              className="block font-headline uppercase tracking-widest text-xs text-on-surface-variant hover:text-primary transition-colors py-2"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
