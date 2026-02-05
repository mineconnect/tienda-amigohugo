import React, { useState } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Credenciales inválidas. Acceso denegado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80"></div>
      <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"></div>

      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors z-20 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium tracking-wide">Volver a la Tienda</span>
      </button>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="glass-panel p-10 rounded-2xl shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl">

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg shadow-accent/5">
              <Lock className="h-6 w-6 text-accent" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-white mb-2">Acceso Restringido</h2>
            <p className="text-gray-400 text-sm font-light">Panel de Administración VHF_Decants</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-lg flex items-center justify-center text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-light"
                  placeholder="admin@vhf.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-light"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 flex justify-center items-center py-3.5 px-4 bg-white text-black rounded-xl font-bold text-sm tracking-wide hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'INGRESAR AL PANEL'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={async () => {
                if (!email || !password) {
                  alert('Por favor completa el Email y Contraseña arriba para registrarte.');
                  return;
                }
                if (!confirm(`¿Registrar nuevo administrador: ${email}?`)) return;

                setLoading(true);
                const { error } = await supabase.auth.signUp({
                  email,
                  password,
                });
                setLoading(false);

                if (error) {
                  alert('Error de registro: ' + error.message);
                } else {
                  alert('¡Usuario registrado! Si Supabase pide confirmación, revisa tu email. Si no, intenta iniciar sesión ahora.');
                }
              }}
              className="text-xs text-gray-500 hover:text-accent transition-colors underline"
            >
              ¿No tienes cuenta? Registrarse como Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
