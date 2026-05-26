import { createPublicClient } from "./publicSupabase";

export const supabase = createPublicClient();

export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  size: string | null;
  size_unit: string | null;
  color: string | null;
  stock_qty: number;
  in_stock: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
};

/** Devuelve el label legible de un size+unit: "Talle M", "200 ml", "Grande", etc. */
export function formatSize(size: string | null, unit: string | null): string {
  if (!size) return "";
  const s = size.trim();
  if (!s) return "";
  switch ((unit || "").toLowerCase()) {
    case "talle":  return `Talle ${s}`;
    case "tamaño": return `Tamaño ${s.toLowerCase()}`;
    case "ml":     return `${s} ml`;
    case "l":      return `${s} L`;
    case "g":      return `${s} g`;
    case "kg":     return `${s} kg`;
    case "cm":     return `${s} cm`;
    case "u":      return `${s} u`;
    default:       return s;
  }
}

export type SiteSetting = {
  key: string;
  value: string | null;
  updated_at: string;
};

export type Settings = Record<string, string>;
