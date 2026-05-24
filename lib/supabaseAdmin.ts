import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Cliente Supabase con service-role key (bypassa RLS).
 * Lazy: solo se inicializa cuando se llama, así el build no falla
 * si las env vars todavía no están configuradas en Vercel.
 * En runtime sí lanza si faltan — fail loud, never silent.
 */
function getAdminClient(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY. " +
        "Configurálas en Vercel → Settings → Environment Variables."
    );
  }

  _client = createClient(supabaseUrl, supabaseServiceKey, {
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
