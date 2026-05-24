"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, CartItem } from "@/lib/cart";

const NAV_LINKS = [
  { label: "Catálogo",  href: "/#catalogo" },
  { label: "Niche",     href: "/?categoria=Niche#catalogo" },
  { label: "Designer",  href: "/?categoria=Designer#catalogo" },
  { label: "Árabes",    href: "/?categoria=Árabes#catalogo" },
  { label: "Editorial", href: "/sobre-nosotros" },
];

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      const items: CartItem[] = getCart();
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
    };
    update();
    window.addEventListener("cart-updated", update);

    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("cart-updated", update);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink-950/80 backdrop-blur-2xl border-b border-gold-400/10"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-6 md:px-10 h-20 max-w-[1400px] mx-auto">
        {/* Logo + monograma */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="font-display italic text-3xl text-gold-gradient leading-none">
            V
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-semibold tracking-wide text-bone">
              VHF Decants
            </span>
            <span className="text-[9px] uppercase tracking-ultra text-gold-400/80 mt-1">
              Atelier · Buenos Aires
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-9 items-center">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative font-body text-[11px] uppercase tracking-widest text-bone/70 hover:text-gold-400 transition-colors duration-300 py-2 group"
            >
              {item.label}
              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-gold-400 group-hover:w-full transition-all duration-500" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-5 text-bone/80">
          <a
            href="https://wa.me/5493834789035"
            target="_blank"
            rel="noopener"
            className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-widest hover:text-gold-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Asesoría
          </a>
          <Link
            href="/cart"
            className="relative group p-2 hover:text-gold-400 transition-colors"
            aria-label="Carrito"
          >
            <span className="material-symbols-outlined text-[22px]">
              shopping_bag
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold-400 text-ink-950 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-fade-in">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden hover:text-gold-400 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <span className="material-symbols-outlined">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-ink-900/95 backdrop-blur-2xl border-t border-gold-400/10 px-6 py-6 space-y-1 animate-fade-in">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block font-body uppercase tracking-widest text-xs text-bone/80 hover:text-gold-400 transition-colors py-3 border-b border-gold-400/5"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://wa.me/5493834789035"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 font-body uppercase tracking-widest text-xs text-gold-400 py-3"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            Asesoría por WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}
