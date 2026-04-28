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
        <Link href="/" className="font-headline text-lg font-bold tracking-widest text-white">
          VHF_Decants
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-8 items-center">
            {[
              { label: "Tendencias", href: "/" },
              { label: "Electrónica", href: "/?categoria=ELECTRÓNICA#catalogo" },
              { label: "Moda", href: "/?categoria=MODA#catalogo" },
              { label: "Hogar", href: "/?categoria=HOGAR Y ESTILO#catalogo" },
              { label: "Gadgets", href: "/?categoria=GADGETS#catalogo" }
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-body text-[10px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-5 text-gray-300">
          <a href="#catalogo" className="hover:scale-110 hover:text-white transition-all hidden md:block">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </a>
          <Link href="/cart" className="hover:scale-110 hover:text-white transition-all relative">
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {/* Hamburger */}
          <button
            className="md:hidden hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-container border-t border-outline-variant/20 px-6 py-4 space-y-3">
          {[
            { label: "Tendencias", href: "/" },
            { label: "Electrónica", href: "/?categoria=ELECTRÓNICA#catalogo" },
            { label: "Moda", href: "/?categoria=MODA#catalogo" },
            { label: "Hogar", href: "/?categoria=HOGAR Y ESTILO#catalogo" },
            { label: "Gadgets", href: "/?categoria=GADGETS#catalogo" }
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block font-headline uppercase tracking-widest text-xs text-on-surface-variant hover:text-primary transition-colors py-2"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
