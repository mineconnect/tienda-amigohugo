import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import type { Producto } from '../types';
import { Trash2, Plus, Image as ImageIcon, LogOut, Package, ExternalLink, Loader2 } from 'lucide-react';

const Admin: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', precio: '', categoria: '', imagen_url: '' });
  const [uploading, setUploading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false });
    if (data) setProductos(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from('productos').upload(filePath, file);

    if (uploadError) {
      console.error('Error upload:', uploadError);
      alert('Error al subir imagen. \n\nPosible causa: Políticas de seguridad (RLS) no configuradas en Supabase Storage. \n\nDetalle: ' + uploadError.message);
    } else {
      const { data } = supabase.storage.from('productos').getPublicUrl(filePath);
      setNuevo({ ...nuevo, imagen_url: data.publicUrl });
    }
    setUploading(false);
    // Limpiar input para permitir subir el mismo archivo si falla
    e.target.value = '';
  };

  const guardarProducto = async () => {
    if (!nuevo.nombre || !nuevo.precio) return alert('Nombre y Precio son obligatorios');

    setLoadingConfig(true);
    const { error } = await supabase.from('productos').insert([{
      nombre: nuevo.nombre,
      descripcion: nuevo.descripcion,
      precio: parseFloat(nuevo.precio),
      imagen_url: nuevo.imagen_url,
      categoria: nuevo.categoria
    }]);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      setNuevo({ nombre: '', descripcion: '', precio: '', categoria: '', imagen_url: '' });
      fetchProductos();
    }
    setLoadingConfig(false);
  };

  const eliminarProducto = async (id: string) => {
    if (!confirm('¿Seguro quieres borrar este producto permanentemente?')) return;
    await supabase.from('productos').delete().eq('id', id);
    fetchProductos();
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-white pb-20">

      {/* Navbar Admin */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white text-black p-1.5 rounded font-serif font-bold text-xl">VHF</div>
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Admin Panel</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="/" target="_blank" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
              <ExternalLink size={16} /> Ver Tienda
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-bold uppercase tracking-wide transition-colors"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
                <Plus className="text-accent" /> Nuevo Producto
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Nombre</label>
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder-gray-700"
                    placeholder="Ej. Decant Creed Aventus"
                    value={nuevo.nombre}
                    onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Precio (ARS)</label>
                    <input
                      type="number"
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none transition-all placeholder-gray-700"
                      placeholder="0.00"
                      value={nuevo.precio}
                      onChange={e => setNuevo({ ...nuevo, precio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Categoría</label>
                    <input
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none transition-all placeholder-gray-700"
                      placeholder="Ej. Nicho"
                      value={nuevo.categoria}
                      onChange={e => setNuevo({ ...nuevo, categoria: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Descripción</label>
                  <textarea
                    rows={3}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none transition-all placeholder-gray-700 resize-none"
                    placeholder="Detalles de la fragancia..."
                    value={nuevo.descripcion}
                    onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <label className={`cursor-pointer w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all ${nuevo.imagen_url ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
                    {nuevo.imagen_url ? (
                      <div className="relative group w-full h-32">
                        <img src={nuevo.imagen_url} className="w-full h-full object-contain rounded-md" alt="Preview" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white bg-black px-2 py-1 rounded">Cambiar Imagen</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {uploading ? <Loader2 className="animate-spin text-accent mb-2" /> : <ImageIcon className="text-gray-500 mb-2" />}
                        <span className="text-xs text-gray-400 font-medium">Click para subir imagen</span>
                      </>
                    )}
                    <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                  </label>
                </div>

                <button
                  onClick={guardarProducto}
                  disabled={loadingConfig || uploading || !nuevo.nombre}
                  className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4"
                >
                  {loadingConfig ? 'Guardando...' : 'Publicar Producto'}
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Lista */}
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
              <div>
                <h2 className="font-serif text-3xl font-bold">Inventario</h2>
                <p className="text-gray-500 text-sm mt-1">Gestiona tu catálogo activo</p>
              </div>
              <span className="text-accent font-mono text-xl">{productos.length} items</span>
            </div>

            <div className="grid gap-4">
              {productos.map(p => (
                <div key={p.id} className="group bg-[#111] hover:bg-[#161616] border border-white/5 hover:border-white/10 p-4 rounded-xl flex gap-4 items-center transition-all">

                  {/* Imagen */}
                  <div className="w-20 h-20 bg-black rounded-lg overflow-hidden border border-white/5 shrink-0">
                    {p.imagen_url ? (
                      <img src={p.imagen_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <Package size={24} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white truncate">{p.nombre}</h3>
                      {p.categoria && <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded uppercase tracking-wider">{p.categoria}</span>}
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-1 mb-2 font-light">{p.descripcion}</p>
                    <div className="font-mono text-accent font-medium">${p.precio}</div>
                  </div>

                  {/* Acciones */}
                  <button
                    onClick={() => eliminarProducto(p.id)}
                    className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Eliminar permanentemente"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {productos.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
                  <Package className="mx-auto text-gray-700 mb-4" size={48} />
                  <p className="text-gray-500">Tu catálogo está vacío.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;