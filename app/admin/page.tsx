import { adminEnvConfigured } from "@/lib/auth";
import AdminLoginForm from "./AdminLoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const configured = adminEnvConfigured();

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,97,0.10),_transparent_60%)]" />

      <div className="relative glass-card hairline rounded-3xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-display italic text-5xl text-gold-gradient leading-none block mb-3">
            V
          </span>
          <p className="font-display text-2xl font-semibold text-bone">VHF</p>
          <p className="text-xs uppercase tracking-widest text-muted mt-2">
            Panel administrador
          </p>
        </div>

        {configured ? (
          <AdminLoginForm />
        ) : (
          <div className="space-y-5">
            <div className="bg-gold-400/10 border border-gold-400/30 rounded-xl p-5">
              <p className="text-sm text-gold-400 font-semibold mb-2">
                ⚙️ Configuración pendiente
              </p>
              <p className="text-xs text-bone/80 leading-relaxed">
                Faltan setear las variables de entorno del admin en Vercel.
                Sin ellas, el panel queda inaccesible — pero la tienda pública
                funciona normalmente.
              </p>
            </div>

            <div className="text-xs text-muted leading-relaxed space-y-2">
              <p className="font-semibold text-bone">Cómo activarlo:</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>
                  Correr{" "}
                  <code className="text-gold-400 bg-ink-900/60 px-1.5 py-0.5 rounded text-[10px]">
                    bash scripts/setup-vercel.sh
                  </code>{" "}
                  desde tu terminal
                </li>
                <li>
                  O setear manualmente en Vercel → Settings → Environment
                  Variables:
                  <ul className="list-disc list-inside pl-3 mt-1 font-mono text-[10px] text-gold-400/80">
                    <li>SUPABASE_SERVICE_ROLE_KEY</li>
                    <li>ADMIN_EMAIL</li>
                    <li>ADMIN_PASSWORD</li>
                    <li>ADMIN_JWT_SECRET</li>
                  </ul>
                </li>
              </ol>
            </div>

            <a
              href="/"
              className="block text-center text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors pt-2"
            >
              ← Volver a la tienda
            </a>
          </div>
        )}

        <p className="text-center text-[10px] uppercase tracking-widest text-muted mt-6">
          Solo Víctor Hugo · Belén · Catamarca
        </p>
      </div>
    </div>
  );
}
