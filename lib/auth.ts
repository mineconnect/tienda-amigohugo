import { SignJWT, jwtVerify } from "jose";

/**
 * Devuelve el secreto si está bien configurado, o null si no.
 * No tira: el middleware necesita poder rechazar sin crashear.
 */
function getSecretSafe(): Uint8Array | null {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

/** Versión estricta: tira si falta el secret. Se usa al firmar (login). */
function getSecretStrict(): Uint8Array {
  const s = getSecretSafe();
  if (!s) {
    throw new Error(
      "ADMIN_JWT_SECRET faltante o demasiado corto (mín. 32 caracteres). " +
        "Configuralo en Vercel → Settings → Environment Variables."
    );
  }
  return s;
}

export async function signAdminToken() {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretStrict());
}

/**
 * Verifica un token. Si el secret no está configurado, devuelve false
 * (el middleware rechaza el request sin crashear todo el sitio).
 */
export async function verifyAdminToken(token: string) {
  const secret = getSecretSafe();
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Útil para mostrar en el login si las env vars del admin no están configuradas. */
export function adminEnvConfigured(): boolean {
  return (
    !!process.env.ADMIN_EMAIL &&
    !!process.env.ADMIN_PASSWORD &&
    !!process.env.ADMIN_JWT_SECRET &&
    process.env.ADMIN_JWT_SECRET.length >= 32 &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
