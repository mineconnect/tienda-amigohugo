"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductsTab from "./ProductsTab";
import CategoriesTab from "./CategoriesTab";
import SettingsTab from "./SettingsTab";

type Tab = "products" | "categories" | "settings";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "products",   label: "Productos",     icon: "inventory_2" },
  { key: "categories", label: "Categorías",    icon: "category" },
  { key: "settings",   label: "Sitio",         icon: "tune" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("products");
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Probar sesión al cargar (el middleware ya nos rebota si falta)
    fetch("/api/admin/products").then((res) => {
      if (res.status === 401) {
        router.push("/admin");
      } else {
        setReady(true);
      }
    });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <p className="text-muted text-xs uppercase tracking-widest animate-pulse">
          Cargando panel...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Topbar */}
      <nav className="fixed top-0 w-full z-50 bg-ink-950/85 backdrop-blur-2xl border-b border-gold-400/15">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-[1500px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="font-display italic text-2xl text-gold-gradient">
              V
            </span>
            <div>
              <p className="font-display text-base font-semibold text-bone leading-none">
                VHF Admin
              </p>
              <p className="text-[9px] uppercase tracking-widest text-muted mt-0.5">
                Belén · Catamarca
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="text-[10px] md:text-xs text-muted hover:text-gold-400 uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                open_in_new
              </span>
              <span className="hidden sm:inline">Ver tienda</span>
            </a>
            <button
              onClick={handleLogout}
              className="text-[10px] md:text-xs text-muted hover:text-error uppercase tracking-widest transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="fixed top-16 w-full z-40 bg-ink-950/85 backdrop-blur-2xl border-b border-gold-400/10">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 md:px-5 py-3 text-[11px] uppercase tracking-widest font-semibold transition-colors whitespace-nowrap border-b-2 ${
                tab === t.key
                  ? "text-gold-400 border-gold-400"
                  : "text-muted border-transparent hover:text-bone"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="pt-32 pb-16 px-4 md:px-8 max-w-[1500px] mx-auto">
        {tab === "products"   && <ProductsTab />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "settings"   && <SettingsTab />}
      </main>
    </div>
  );
}
