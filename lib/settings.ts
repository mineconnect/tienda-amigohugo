import { createClient } from "@supabase/supabase-js";
import type { Settings } from "@/lib/supabase";

/**
 * Lee todos los site_settings desde Supabase y devuelve un objeto plano.
 * Provee fallbacks robustos para que la home renderice incluso si:
 *  - las env vars no están configuradas (build inicial sin Supabase)
 *  - la DB está vacía
 *  - hay un error de red
 */
export async function getSettings(): Promise<Settings> {
  const fallback: Settings = {
    hero_eyebrow: "Importaciones · Belén · Catamarca",
    hero_title: "Lo mejor de Salta y Bolivia,",
    hero_title_italic: "a tu alcance.",
    hero_subtitle:
      "Víctor Hugo Figueroa viaja, selecciona y trae los mejores productos para vos.",
    hero_cta_primary: "Ver catálogo",
    hero_cta_secondary: "Hablar por WhatsApp",
    metric_1_value: "+200",
    metric_1_label: "Productos importados",
    metric_2_value: "100%",
    metric_2_label: "Selección personal",
    metric_3_value: "24h",
    metric_3_label: "Respuesta por WhatsApp",
    valueprop_1_title: "Precios sin intermediarios",
    valueprop_1_desc: "Compramos directo en origen. Sin cadenas, sin sobreprecios.",
    valueprop_2_title: "Selección personal",
    valueprop_2_desc:
      "Cada producto lo elige Víctor Hugo en sus viajes.",
    valueprop_3_title: "Envíos a todo el país",
    valueprop_3_desc:
      "Despachamos por correo a cualquier ciudad de Argentina con tracking.",
    valueprop_4_title: "Atención por WhatsApp",
    valueprop_4_desc: "Te respondemos en minutos.",
    about_title: "Conocé a Víctor Hugo",
    about_text:
      "Soy Víctor Hugo Figueroa, de Belén (Catamarca). Recorro el norte argentino y Bolivia para traerte productos buenos, lindos y a precio justo.",
    contact_whatsapp: "5493834789035",
    contact_whatsapp_display: "+54 9 3834 78-9035",
    contact_city: "Belén, Catamarca",
    contact_instagram: "vhf_belen",
    contact_email: "hola@vhfbelen.com.ar",
    shipping_threshold: "50000",
    shipping_note: "Envío gratis en compras superiores a $50.000",
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallback;

  try {
    const sb = createClient(url, key);
    const { data, error } = await sb.from("site_settings").select("key,value");
    if (error || !data) return fallback;
    const merged: Settings = { ...fallback };
    for (const row of data) {
      if (row.value !== null && row.value !== undefined) {
        merged[row.key] = row.value;
      }
    }
    return merged;
  } catch {
    return fallback;
  }
}
