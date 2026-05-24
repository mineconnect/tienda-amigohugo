/**
 * Cliente público de Supabase (anon key) con valores por defecto bakeados.
 *
 * Los valores `NEXT_PUBLIC_*` viajan al navegador igual (Next los inyecta
 * en el bundle de cliente). Tener defaults acá evita que el sitio se rompa
 * si las env vars no están seteadas en Vercel. Estas claves son las
 * "publishable keys" — son seguras de exponer (RLS protege la DB).
 *
 * Para sobrescribirlas (ej. para usar otro proyecto Supabase), seteá
 * `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en Vercel.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://bzvfydkqpkcqfnuuyagt.supabase.co";

export const PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6dmZ5ZGtxcGtjcWZudXV5YWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDYxNTUsImV4cCI6MjA5NDA4MjE1NX0.CtQOoeDi1sUdg9mOGyCLcXhQMZVHsBJJJdb2P6jPmX0";

export function createPublicClient(): SupabaseClient {
  return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}
