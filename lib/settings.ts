import { createPublicClient } from "@/lib/publicSupabase";
import type { Settings } from "@/lib/supabase";

export async function getSettings(): Promise<Settings> {
  const fallback: Settings = {
    hero_eyebrow: "VHF Decants · Belén · Catamarca",
    hero_title: "Buen gusto,",
    hero_title_italic: "a tu casa.",
    hero_subtitle: "Tienda online. Envíos a todo el país.",
    hero_cta_primary: "Ver catálogo",
    hero_cta_secondary: "WhatsApp",
    metric_1_value: "+200",
    metric_1_label: "Productos",
    metric_2_value: "24h",
    metric_2_label: "Respuesta",
    metric_3_value: "AR",
    metric_3_label: "Envíos al país",
    valueprop_1_title: "Precio justo",
    valueprop_1_desc: "Sin intermediarios.",
    valueprop_2_title: "Selección curada",
    valueprop_2_desc: "Solo lo bueno.",
    valueprop_3_title: "Envíos al país",
    valueprop_3_desc: "Con tracking.",
    valueprop_4_title: "Atención WhatsApp",
    valueprop_4_desc: "Te respondemos en minutos.",
    about_title: "Sobre nosotros",
    about_text: "VHF Decants · Belén, Catamarca.",
    contact_whatsapp: "5493834789035",
    contact_whatsapp_display: "+54 9 3834 78-9035",
    contact_city: "Belén, Catamarca",
    contact_instagram: "vhf_belen",
    contact_email: "hola@vhfbelen.com.ar",
    shipping_threshold: "50000",
    shipping_note: "Envío gratis en compras superiores a $50.000",
  };

  try {
    const sb = createPublicClient();
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
