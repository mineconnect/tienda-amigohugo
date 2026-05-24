"use client";
import { useEffect, useState } from "react";

type Setting = { key: string; value: string | null; updated_at?: string };

// Configuración de qué campos mostrar y cómo etiquetarlos.
// El orden y los grupos importan: aparecen así en el UI.
const FIELD_GROUPS: { title: string; icon: string; fields: { key: string; label: string; multiline?: boolean; placeholder?: string }[] }[] = [
  {
    title: "Hero (encabezado de la home)",
    icon: "view_carousel",
    fields: [
      { key: "hero_eyebrow",      label: "Texto chiquito sobre el título",     placeholder: "Importaciones · Belén · Catamarca" },
      { key: "hero_title",        label: "Título principal — parte 1",         placeholder: "Lo mejor de Salta y Bolivia," },
      { key: "hero_title_italic", label: "Título principal — parte 2 (cursiva, en dorado)", placeholder: "a tu alcance." },
      { key: "hero_subtitle",     label: "Subtítulo (texto explicativo)",      multiline: true, placeholder: "Víctor Hugo viaja, selecciona y trae..." },
      { key: "hero_cta_primary",  label: "Botón principal",                    placeholder: "Ver catálogo" },
      { key: "hero_cta_secondary",label: "Botón secundario",                   placeholder: "Hablar por WhatsApp" },
    ],
  },
  {
    title: "Métricas de confianza (debajo del hero)",
    icon: "leaderboard",
    fields: [
      { key: "metric_1_value", label: "Métrica 1 — número" },
      { key: "metric_1_label", label: "Métrica 1 — etiqueta" },
      { key: "metric_2_value", label: "Métrica 2 — número" },
      { key: "metric_2_label", label: "Métrica 2 — etiqueta" },
      { key: "metric_3_value", label: "Métrica 3 — número" },
      { key: "metric_3_label", label: "Métrica 3 — etiqueta" },
    ],
  },
  {
    title: "Beneficios (las 4 columnas)",
    icon: "stars",
    fields: [
      { key: "valueprop_1_title", label: "Beneficio 1 — título" },
      { key: "valueprop_1_desc",  label: "Beneficio 1 — descripción", multiline: true },
      { key: "valueprop_2_title", label: "Beneficio 2 — título" },
      { key: "valueprop_2_desc",  label: "Beneficio 2 — descripción", multiline: true },
      { key: "valueprop_3_title", label: "Beneficio 3 — título" },
      { key: "valueprop_3_desc",  label: "Beneficio 3 — descripción", multiline: true },
      { key: "valueprop_4_title", label: "Beneficio 4 — título" },
      { key: "valueprop_4_desc",  label: "Beneficio 4 — descripción", multiline: true },
    ],
  },
  {
    title: "Sobre Víctor Hugo (sección con cita)",
    icon: "format_quote",
    fields: [
      { key: "about_title", label: "Título de la sección" },
      { key: "about_text",  label: "Texto principal (cita / manifiesto)", multiline: true },
    ],
  },
  {
    title: "Contacto",
    icon: "contacts",
    fields: [
      { key: "contact_whatsapp",         label: "WhatsApp — solo números (incluyendo código país)" },
      { key: "contact_whatsapp_display", label: "WhatsApp — cómo mostrarlo" },
      { key: "contact_city",             label: "Ciudad / ubicación" },
      { key: "contact_instagram",        label: "Usuario de Instagram (sin @)" },
      { key: "contact_email",            label: "Correo electrónico" },
    ],
  },
  {
    title: "Envíos",
    icon: "local_shipping",
    fields: [
      { key: "shipping_threshold", label: "Mínimo de compra para envío gratis ($)" },
      { key: "shipping_note",      label: "Mensaje sobre envíos" },
    ],
  },
];

export default function SettingsTab() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data: Setting[] = await res.json();
      const map: Record<string, string> = {};
      for (const s of data) map[s.key] = s.value ?? "";
      setValues(map);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const settings = Object.entries(values).map(([key, value]) => ({
        key,
        value,
      }));
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setSavedAt(new Date());
        setTimeout(() => setSavedAt(null), 3000);
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Error al guardar");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-muted animate-pulse text-xs uppercase tracking-widest">
        Cargando configuración...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-bone">
            Contenido del sitio
          </h1>
          <p className="text-xs uppercase tracking-widest text-muted mt-1">
            Editá todos los textos de la home y el contacto · sin tocar código
          </p>
        </div>
        <div className="flex items-center gap-4">
          {savedAt && (
            <p className="text-[11px] text-emerald-400 uppercase tracking-widest animate-fade-in">
              ✓ Guardado {savedAt.toLocaleTimeString("es-AR")}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gold disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error text-sm">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {FIELD_GROUPS.map((group) => (
          <div
            key={group.title}
            className="glass-card hairline rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gold-400/10">
              <div className="w-10 h-10 rounded-lg bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
                <span className="material-symbols-outlined text-[20px]">
                  {group.icon}
                </span>
              </div>
              <h2 className="font-display text-xl text-bone">{group.title}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {group.fields.map((f) => (
                <div
                  key={f.key}
                  className={f.multiline ? "md:col-span-2" : ""}
                >
                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-1.5">
                    {f.label}
                  </label>
                  {f.multiline ? (
                    <textarea
                      value={values[f.key] || ""}
                      onChange={(e) =>
                        setValues({ ...values, [f.key]: e.target.value })
                      }
                      rows={3}
                      placeholder={f.placeholder}
                      className="w-full bg-ink-900/60 border border-gold-400/20 rounded-lg px-4 py-2.5 text-sm text-bone focus:outline-none focus:border-gold-400/60 transition-colors resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[f.key] || ""}
                      onChange={(e) =>
                        setValues({ ...values, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder}
                      className="w-full bg-ink-900/60 border border-gold-400/20 rounded-lg px-4 py-2.5 text-sm text-bone focus:outline-none focus:border-gold-400/60 transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 mt-8 -mx-4 md:-mx-8 px-4 md:px-8 py-4 bg-ink-950/95 backdrop-blur-xl border-t border-gold-400/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-gold w-full md:w-auto md:ml-auto md:flex disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          {saving ? "Guardando..." : "Guardar todos los cambios"}
        </button>
      </div>
    </div>
  );
}
