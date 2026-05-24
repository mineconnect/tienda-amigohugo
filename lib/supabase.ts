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
  color: string | null;
  stock_qty: number;
  in_stock: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
};

export type SiteSetting = {
  key: string;
  value: string | null;
  updated_at: string;
};

export type Settings = Record<string, string>;
