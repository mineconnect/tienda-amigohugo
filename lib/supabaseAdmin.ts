import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL } from "./publicSupabase";

let _client: SupabaseClient | null = null;

/**
 * Cliente Supabase con service-role key (bypassa RLS).
 * Lazy: solo se inicializa cuando se llama, así el build no falla
 * si las env vars todavía no están configuradas en Vercel.
 * En runtime sí lanza si faltan — fail loud, never silent.
 *
 * La URL usa el default público (lib/publicSupabase). La service key
 * NUNCA tiene fallback — debe venir de env var en Vercel.
 */
function getAdminClient(): SupabaseClient {
  if (_client) return _client;

  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY. " +
        "Configurala en Vercel → Settings → Environment Variables."
    );
  }

  _client = createClient(PUBLIC_SUPABASE_URL, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}

export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getAdminClient();
    // @ts-expect-error — proxy passthrough
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
