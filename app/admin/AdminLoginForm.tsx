"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
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

      {error && <p className="text-error text-xs text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-gold disabled:opacity-50"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
