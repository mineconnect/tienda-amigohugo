"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/lib/supabase";

type FormData = {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
  notes: string;
  size: string;
  in_stock: boolean;
  featured: boolean;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category: "",
  notes: "",
  size: "",
  in_stock: true,
  featured: false,
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      if (!res.ok) {
        console.error("API error:", res.status);
        setProducts([]);
        return;
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      image_url: p.image_url || "",
      category: p.category || "",
      notes: (p.notes || []).join(", "),
      size: p.size || "",
      in_stock: p.in_stock,
      featured: p.featured || false,
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { setError("Nombre y precio son requeridos"); return; }
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      image_url: form.image_url || null,
      category: form.category || null,
      notes: form.notes ? form.notes.split(",").map((n) => n.trim()).filter(Boolean) : [],
      size: form.size || null,
      in_stock: form.in_stock,
      featured: form.featured,
    };

    const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await loadProducts();
      setShowForm(false);
    } else {
      const d = await res.json();
      setError(d.error || "Error al guardar");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) { await loadProducts(); setDeleteConfirm(null); }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-6 md:px-8 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="font-headline text-primary font-bold">VHF Decants</span>
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">/ Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-xs text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest">
              Ver tienda
            </a>
            <button
              onClick={handleLogout}
              className="text-xs text-error hover:opacity-80 transition-opacity uppercase tracking-widest"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-background">Productos</h1>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mt-1">
              {products.length} artículos en el catálogo
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex bg-surface-container rounded-full p-1 border border-outline-variant/20">
              <button
                onClick={() => setFilterFeatured(false)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${!filterFeatured ? "bg-primary text-on-primary-fixed shadow-lg" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterFeatured(true)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${filterFeatured ? "bg-[#d946ef] text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Tendencias
              </button>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-primary text-on-primary-fixed font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-primary-dim transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Nuevo producto
            </button>
          </div>
        </div>

        {/* Product list */}
        {loading ? (
          <div className="text-center py-24 text-on-surface-variant">
            <p className="text-sm uppercase tracking-widest animate-pulse">Cargando...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">inventory_2</span>
            <p className="text-sm uppercase tracking-widest mb-6">No hay productos todavía</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={openCreate} className="bg-primary text-on-primary-fixed font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-full hover:bg-primary-dim transition-colors">
                Crear nuevo
              </button>
              <button 
                onClick={async () => {
                  if (!confirm("¿Quieres cargar los productos iniciales de tendencia?")) return;
                  const res = await fetch("/api/admin/seed", { method: "POST" });
                  const data = await res.json();
                  if (data.ok) {
                    alert("¡Listo! Ahora puedes editar los productos.");
                    loadProducts();
                  } else {
                    alert("Error: " + (data.error || "No se pudo cargar"));
                  }
                }}
                className="bg-secondary text-on-secondary-fixed font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-full hover:bg-secondary-dim transition-colors"
              >
                Cargar Tendencias Iniciales
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {products
              .filter((p) => (filterFeatured ? p.featured : true))
              .map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 glass-card rounded-xl p-4 border border-outline-variant/10"
              >
                {/* Image */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 relative">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl text-on-surface-variant opacity-30">spa</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-on-surface truncate">{product.name}</p>
                    {product.featured && (
                      <span className="text-[10px] uppercase tracking-widest text-[#d946ef] bg-[#d946ef]/10 px-2 py-0.5 rounded-full">
                        Tendencia
                      </span>
                    )}
                    {!product.in_stock && (
                      <span className="text-[10px] uppercase tracking-widest text-error bg-error/10 px-2 py-0.5 rounded-full">
                        Sin stock
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-primary font-bold text-sm">${product.price.toLocaleString("es-AR")}</span>
                    {product.size && <span className="text-xs text-on-surface-variant">{product.size}</span>}
                    {product.category && <span className="text-xs text-on-surface-variant">{product.category}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(product)}
                    className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg border border-outline-variant/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-xl font-bold">
                {editing ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ej: Oud Wood Decant"
                  required
                />
              </div>

              {/* Price & Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1.5">
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                    placeholder="1500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1.5">
                    Tamaño
                  </label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                    placeholder="Ej: 5ml, 10ml"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Categoría
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ej: Eau de Parfum, Oriental"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Notas (separadas por coma)
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ej: Oud, Vainilla, Ámbar"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Foto del producto (URL o Subir archivo)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="flex-1 bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                    placeholder="https://... o Base64"
                  />
                  <label className="bg-surface-container border border-outline-variant/30 px-4 py-2.5 rounded-lg cursor-pointer hover:border-primary transition-colors text-sm flex-shrink-0 text-on-surface-variant">
                    <span className="material-symbols-outlined text-base align-middle">upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setForm({ ...form, image_url: ev.target.result as string });
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
                {form.image_url && (
                  <div className="mt-2 w-20 h-20 relative rounded-lg overflow-hidden border border-outline-variant/30">
                    <Image src={form.image_url} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Descripción del perfume..."
                />
              </div>

              <div className="flex flex-wrap gap-8 items-center pt-2">
                {/* In stock */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, in_stock: !form.in_stock })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.in_stock ? "bg-primary" : "bg-outline-variant"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.in_stock ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </button>
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant">
                    {form.in_stock ? "Disponible" : "Sin stock"}
                  </label>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-secondary" : "bg-outline-variant"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </button>
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant">
                    {form.featured ? "Destacado (Tendencia)" : "Normal"}
                  </label>
                </div>
              </div>

              {error && <p className="text-error text-xs">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-full border border-outline-variant/30 text-xs uppercase tracking-widest text-on-surface-variant hover:border-outline transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-full bg-primary text-on-primary-fixed font-bold text-xs uppercase tracking-widest hover:bg-primary-dim transition-colors disabled:opacity-50"
                >
                  {saving ? "Guardando..." : editing ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm border border-outline-variant/20 text-center">
            <span className="material-symbols-outlined text-4xl text-error mb-3 block">delete</span>
            <h3 className="font-headline text-lg font-bold mb-2">¿Eliminar producto?</h3>
            <p className="text-xs text-on-surface-variant mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-full border border-outline-variant/30 text-xs uppercase tracking-widest text-on-surface-variant hover:border-outline transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-full bg-error text-white font-bold text-xs uppercase tracking-widest hover:bg-error-dim transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
