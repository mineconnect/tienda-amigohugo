"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import type { Product, Category } from "@/lib/supabase";

type FormData = {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category_id: string;
  size: string;
  color: string;
  stock_qty: string;
  in_stock: boolean;
  featured: boolean;
  sort_order: string;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category_id: "",
  size: "",
  color: "",
  stock_qty: "0",
  in_stock: true,
  featured: false,
  sort_order: "0",
};

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "featured" | "out_of_stock">("all");
  const [search, setSearch] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);
      const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
      setProducts(Array.isArray(pData) ? pData : []);
      setCategories(Array.isArray(cData) ? cData : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filterCat && p.category_id !== filterCat) return false;
      if (filterStatus === "featured" && !p.featured) return false;
      if (filterStatus === "out_of_stock" && p.in_stock) return false;
      if (
        search.trim() &&
        !p.name.toLowerCase().includes(search.toLowerCase().trim())
      )
        return false;
      return true;
    });
  }, [products, filterCat, filterStatus, search]);

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
      category_id: p.category_id || "",
      size: p.size || "",
      color: p.color || "",
      stock_qty: String(p.stock_qty ?? 0),
      in_stock: p.in_stock,
      featured: p.featured,
      sort_order: String(p.sort_order ?? 0),
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setError("Nombre y precio son obligatorios");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      image_url: form.image_url.trim() || null,
      category_id: form.category_id || null,
      size: form.size.trim() || null,
      color: form.color.trim() || null,
      stock_qty: parseInt(form.stock_qty, 10) || 0,
      in_stock: form.in_stock,
      featured: form.featured,
      sort_order: parseInt(form.sort_order, 10) || 0,
    };

    const url = editing
      ? `/api/admin/products/${editing.id}`
      : "/api/admin/products";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await loadAll();
        setShowForm(false);
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Error al guardar");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadAll();
      setDeleteConfirm(null);
    }
  };

  const toggleInStock = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_stock: !p.in_stock }),
    });
    loadAll();
  };

  const toggleFeatured = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });
    loadAll();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-bone">
            Productos
          </h1>
          <p className="text-xs uppercase tracking-widest text-muted mt-1">
            {products.length} en el catálogo · {filtered.length} mostrados
          </p>
        </div>
        <button onClick={openCreate} className="btn-gold">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Nuevo producto
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-ink-900/60 border border-gold-400/20 rounded-lg px-4 py-2.5 text-sm text-bone focus:outline-none focus:border-gold-400/60"
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="bg-ink-900/60 border border-gold-400/20 rounded-lg px-4 py-2.5 text-sm text-bone focus:outline-none focus:border-gold-400/60"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="bg-ink-900/60 border border-gold-400/20 rounded-lg px-4 py-2.5 text-sm text-bone focus:outline-none focus:border-gold-400/60"
        >
          <option value="all">Todos los estados</option>
          <option value="featured">Solo destacados</option>
          <option value="out_of_stock">Sin stock</option>
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-24 text-muted animate-pulse text-xs uppercase tracking-widest">
          Cargando...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-gold-400/15 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-gold-400/30 mb-3 block">
            inventory_2
          </span>
          <p className="text-sm uppercase tracking-widest text-muted mb-6">
            {products.length === 0
              ? "Cargá tu primer producto"
              : "No hay productos con esos filtros"}
          </p>
          {products.length === 0 && (
            <button onClick={openCreate} className="btn-gold">
              Crear producto
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((product) => {
            const cat = categories.find((c) => c.id === product.category_id);
            return (
              <div
                key={product.id}
                className="flex items-center gap-4 glass-card hairline rounded-xl p-3 md:p-4"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-ink-700 flex-shrink-0 relative">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl text-gold-400/30">
                        inventory_2
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display text-base text-bone truncate">
                      {product.name}
                    </p>
                    {product.featured && (
                      <span className="text-[9px] uppercase tracking-widest text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-full border border-gold-400/30">
                        ★ Destacado
                      </span>
                    )}
                    {!product.in_stock && (
                      <span className="text-[9px] uppercase tracking-widest text-error bg-error/10 px-2 py-0.5 rounded-full border border-error/30">
                        Sin stock
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted">
                    <span className="text-gold-400 font-semibold">
                      ${product.price.toLocaleString("es-AR")}
                    </span>
                    {cat && <span>· {cat.name}</span>}
                    {product.size && <span>· Talle {product.size}</span>}
                    {product.color && <span>· {product.color}</span>}
                    {product.stock_qty > 0 && (
                      <span>· {product.stock_qty} u.</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleFeatured(product)}
                    title={product.featured ? "Quitar destacado" : "Marcar destacado"}
                    className={`p-2 rounded-lg transition-colors ${
                      product.featured
                        ? "text-gold-400 bg-gold-400/10"
                        : "text-muted hover:text-gold-400 hover:bg-gold-400/5"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      star
                    </span>
                  </button>
                  <button
                    onClick={() => toggleInStock(product)}
                    title={product.in_stock ? "Marcar sin stock" : "Marcar con stock"}
                    className={`p-2 rounded-lg transition-colors ${
                      product.in_stock
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-muted hover:text-emerald-400 hover:bg-emerald-400/5"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {product.in_stock ? "check_circle" : "remove_circle"}
                    </span>
                  </button>
                  <button
                    onClick={() => openEdit(product)}
                    className="p-2 rounded-lg text-muted hover:text-gold-400 hover:bg-gold-400/5 transition-colors"
                    title="Editar"
                  >
                    <span className="material-symbols-outlined text-base">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="p-2 rounded-lg text-muted hover:text-error hover:bg-error/10 transition-colors"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined text-base">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-sm">
          <div className="glass-card hairline rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-bone">
                {editing ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted hover:text-bone"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <Field label="Nombre *">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  maxLength={200}
                  className="form-input"
                  placeholder="Ej: Campera de jean oversize"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Precio (ARS) *">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="form-input"
                    placeholder="15000"
                  />
                </Field>
                <Field label="Categoría">
                  <select
                    value={form.category_id}
                    onChange={(e) =>
                      setForm({ ...form, category_id: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Talle / Tamaño">
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="form-input"
                    placeholder="M, 42, 2 plazas..."
                  />
                </Field>
                <Field label="Color">
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
                    className="form-input"
                    placeholder="Negro"
                  />
                </Field>
                <Field label="Stock disponible">
                  <input
                    type="number"
                    min="0"
                    value={form.stock_qty}
                    onChange={(e) =>
                      setForm({ ...form, stock_qty: e.target.value })
                    }
                    className="form-input"
                  />
                </Field>
              </div>

              <Field label="URL o foto del producto">
                <div className="flex gap-2 items-stretch">
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) =>
                      setForm({ ...form, image_url: e.target.value })
                    }
                    className="form-input flex-1"
                    placeholder="https://imgbb.com/..."
                  />
                  <label className="bg-ink-900/60 border border-gold-400/20 px-4 py-2.5 rounded-lg cursor-pointer hover:border-gold-400/60 transition-colors text-sm flex items-center gap-2 text-muted">
                    <span className="material-symbols-outlined text-base">
                      upload
                    </span>
                    Subir
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
                            setForm({
                              ...form,
                              image_url: ev.target.result as string,
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
                {form.image_url && (
                  <div className="mt-2 w-24 h-24 relative rounded-lg overflow-hidden border border-gold-400/20">
                    <Image
                      src={form.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </Field>

              <Field label="Descripción">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="form-input resize-none"
                  placeholder="Materiales, talles, recomendaciones..."
                />
              </Field>

              <Field label="Orden (menor = primero)">
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: e.target.value })
                  }
                  className="form-input"
                />
              </Field>

              <div className="flex flex-wrap gap-6 items-center pt-2">
                <Toggle
                  on={form.in_stock}
                  onChange={(v) => setForm({ ...form, in_stock: v })}
                  labelOn="Disponible"
                  labelOff="Sin stock"
                />
                <Toggle
                  on={form.featured}
                  onChange={(v) => setForm({ ...form, featured: v })}
                  labelOn="★ Destacado"
                  labelOff="Normal"
                />
              </div>

              {error && <p className="text-error text-xs">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold flex-1 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-sm">
          <div className="glass-card hairline rounded-2xl p-8 w-full max-w-sm text-center">
            <span className="material-symbols-outlined text-5xl text-error mb-4 block">
              delete
            </span>
            <h3 className="font-display text-xl text-bone mb-2">
              ¿Eliminar producto?
            </h3>
            <p className="text-xs text-muted mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-full bg-error text-white font-semibold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          background: rgba(17, 17, 17, 0.6);
          border: 1px solid rgba(201, 169, 97, 0.2);
          border-radius: 0.5rem;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: #e8e0cf;
          transition: border-color 150ms;
        }
        :global(.form-input:focus) {
          outline: none;
          border-color: rgba(201, 169, 97, 0.6);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  on,
  onChange,
  labelOn,
  labelOff,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  labelOn: string;
  labelOff: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!on)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          on ? "bg-gold-400" : "bg-ink-600"
        }`}
        aria-pressed={on}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
      <label className="text-[11px] uppercase tracking-widest text-muted">
        {on ? labelOn : labelOff}
      </label>
    </div>
  );
}
