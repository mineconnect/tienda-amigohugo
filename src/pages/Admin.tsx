import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import type { Producto } from '../types'; // <--- AGREGADO "type"
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';

const Admin: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', precio: '', categoria: '', imagen_url: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false });
    if (data) setProductos(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from('productos').upload(filePath, file);

    if (uploadError) {
      alert('Error subiendo imagen');
    } else {
      const { data } = supabase.storage.from('productos').getPublicUrl(filePath);
      setNuevo({ ...nuevo, imagen_url: data.publicUrl });
    }
    setUploading(false);
  };

  const guardarProducto = async () => {
    if (!nuevo.nombre || !nuevo.precio) return alert('Nombre y Precio son obligatorios');
    
    const { error } = await supabase.from('productos').insert([{
      nombre: nuevo.nombre,
      descripcion: nuevo.descripcion,
      precio: parseFloat(nuevo.precio),
      imagen_url: nuevo.imagen_url,
      categoria: nuevo.categoria
    }]);

    if (error) alert('Error al guardar: ' + error.message);
    else {
      setNuevo({ nombre: '', descripcion: '', precio: '', categoria: '', imagen_url: '' });
      fetchProductos();
    }
  };

  const eliminarProducto = async (id: string) => {
    if(!confirm('¿Seguro quieres borrarlo?')) return;
    await supabase.from('productos').delete().eq('id', id);
    fetchProductos();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
        <a href="/" className="text-indigo-600 hover:underline">Ver Tienda</a>
      </div>

      {/* Formulario de Carga */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          placeholder="Nombre del producto" 
          className="border p-2 rounded"
          value={nuevo.nombre}
          onChange={e => setNuevo({...nuevo, nombre: e.target.value})}
        />
        <input 
          placeholder="Precio" 
          type="number"
          className="border p-2 rounded"
          value={nuevo.precio}
          onChange={e => setNuevo({...nuevo, precio: e.target.value})}
        />
        <input 
          placeholder="Categoría" 
          className="border p-2 rounded"
          value={nuevo.categoria}
          onChange={e => setNuevo({...nuevo, categoria: e.target.value})}
        />
        <div className="flex items-center gap-2">
           <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2 text-sm">
             <ImageIcon size={16}/> {uploading ? 'Subiendo...' : 'Subir Foto'}
             <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} />
           </label>
           {nuevo.imagen_url && <span className="text-green-600 text-xs">¡Foto lista!</span>}
        </div>
        <textarea 
          placeholder="Descripción" 
          className="border p-2 rounded col-span-1 md:col-span-2"
          value={nuevo.descripcion}
          onChange={e => setNuevo({...nuevo, descripcion: e.target.value})}
        />
        <button 
          onClick={guardarProducto}
          disabled={uploading}
          className="col-span-1 md:col-span-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 flex justify-center items-center gap-2"
        >
          <Plus size={18} /> Agregar Producto
        </button>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Imagen</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  {p.imagen_url && <img src={p.imagen_url} className="w-12 h-12 object-cover rounded" />}
                </td>
                <td className="p-4 font-medium">{p.nombre}</td>
                <td className="p-4">${p.precio}</td>
                <td className="p-4">
                  <button onClick={() => eliminarProducto(p.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Admin;