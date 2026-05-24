"use client";
import { useEffect, useState } from "react";
import type { Category } from "@/lib/supabase";

type Cat = Category & { product_count?: number };

type FormData = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  sort_order: string;
  active: boolean;
};

const empty: FormData = {
  slug: "",
  name: "",
  icon: "category",
  description: "",
  sort_order: "0",
  active: true,
};

const COMMON_ICONS = [
  "category", "checkroom", "footprint", "kitchen", "home", "watch",
  "shopping_bag", "devices", "face_retouching_natural", "sports_esports",
  "toys", "sports", "school", "child_friendly", "pets", "spa",
  "auto_awesome", "local_florist", "diamond", "directions_car",
];

export default function CategoriesTab() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<Cat | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCats(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setError("");
    setShowForm(true);
  };

  const openEdit = (c: Cat) => {
    setEditing(c);
    setForm({
      slug: c.slug,
      name: c.name,
      icon: c.icon || "category",
      description: c.description || "",
      sort_order: String(c.sort_order ?? 0),
      active: c.active,
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Nombre y slug son obligatorios");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      icon: form.icon.trim() || "category",
      description: form.description.trim() || null,
      sort_order: parseInt(form.sort_order, 10) || 0,
      active: form.active,
    };

    const url = editing
      ? `/api/admin/categories/${editing.id}`
      : "/api/admin/categories";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await load();
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
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await load();
      setDeleteConfirm(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-bone">
            Categorías
          </h1>
          <p className="text-xs uppercase tracking-widest text-muted mt-1">
            {cats.length} categoría{cats.length === 1 ? "" : "s"} en total
          </p>
        </div>
        <button onClick={openCreate} className="btn-gold">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Nueva categoría
        </button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-muted animate-pulse text-xs uppercase tracking-widest">
          Cargando...
        </div>
      ) : cats.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-gold-400/15 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-gold-400/30 mb-3 block">
            category
          </span>
          <p className="text-sm uppercase tracking-widest text-muted mb-6">
            Cargá tu primera categoría
          </p>
          <button onClick={openCreate} className="btn-gold">
            Crear categoría
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((c) => (
            <div
              key={c.id}
              className={`glass-card hairline rounded-2xl p-5 ${
                !c.active ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
                    <span className="material-symbols-outlined">
                      {c.icon || "category"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-bone">{c.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-muted">
                      /{c.slug}
                    </p>
                  </div>
                </div>
                {!c.active && (
                  <span className="text-[9px] uppercase tracking-widest text-error">
                    Inactiva
                  </span>
                )}
              </div>
              {c.description && (
                <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-2">
                  {c.description}
                </p>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-gold-400/10">
                <span className="text-[10px] uppercase tracking-widest text-muted">
                  {c.product_count ?? 0} producto
                  {c.product_count === 1 ? "" : "s"}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1.5 rounded-lg text-muted hover:text-gold-400 hover:bg-gold-400/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(c)}
                    className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-sm">
          <div className="glass-card hairline rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-bone">
                {editing ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted hover:text-bone"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nombre *">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm({
                        ...form,
                        name,
                        slug: editing ? form.slug : slugify(name),
                      });
                    }}
                    required
                    maxLength={100}
                    className="form-input"
                    placeholder="Ropa"
                  />
                </Field>
                <Field label="Slug (URL) *">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: slugify(e.target.value) })
                    }
                    required
                    className="form-input"
                    placeholder="ropa"
                  />
                </Field>
              </div>

              <Field label="Descripción">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                  className="form-input resize-none"
                  placeholder="Breve descripción de la categoría"
                />
              </Field>

              <Field label="Icono">
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 mb-2">
                  {COMMON_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm({ ...form, icon })}
                      className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                        form.icon === icon
                          ? "bg-gold-400 text-ink-950"
                          : "bg-ink-900/60 text-muted hover:text-gold-400 hover:bg-gold-400/10"
                      }`}
                      title={icon}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {icon}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="form-input"
                  placeholder="O escribí cualquier ícono de Material Symbols"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3 items-end">
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
                <div className="flex items-center gap-3 pb-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      form.active ? "bg-gold-400" : "bg-ink-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        form.active ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <label className="text-[11px] uppercase tracking-widest text-muted">
                    {form.active ? "Activa" : "Inactiva"}
                  </label>
                </div>
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
              ¿Eliminar &ldquo;{deleteConfirm.name}&rdquo;?
            </h3>
            <p className="text-xs text-muted mb-6">
              {(deleteConfirm.product_count ?? 0) > 0
                ? `Tiene ${deleteConfirm.product_count} producto(s) asignado(s). Los productos quedarán sin categoría.`
                : "Esta acción no se puede deshacer."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 py-3 rounded-full bg-error text-white font-semibold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
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
