"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Credenciales incorrectas");
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,97,0.10),_transparent_60%)]" />

      <div className="relative glass-card hairline rounded-3xl p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display italic text-5xl text-gold-gradient leading-none block mb-3">
            V
          </span>
          <p className="font-display text-2xl font-semibold text-bone">VHF</p>
          <p className="text-xs uppercase tracking-widest text-muted mt-2">
            Panel administrador
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Correo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ink-900/60 border border-gold-400/20 rounded-lg px-4 py-3 text-sm text-bone focus:outline-none focus:border-gold-400 transition-colors"
              placeholder="hugo@vhfbelen.com.ar"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ink-900/60 border border-gold-400/20 rounded-lg px-4 py-3 text-sm text-bone focus:outline-none focus:border-gold-400 transition-colors"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-error text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-[10px] uppercase tracking-widest text-muted mt-6">
          Solo Víctor Hugo · Belén · Catamarca
        </p>
      </div>
    </div>
  );
}
