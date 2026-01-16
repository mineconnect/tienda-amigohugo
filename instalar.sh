#!/bin/bash

# 1. Crear estructura de carpetas
echo "Creando estructura de directorios..."
mkdir -p src/pages src/supabase src/components src/types

# 2. Crear archivos de configuración

# .env
echo "Creando .env..."
cat << 'EOF' > .env
VITE_SUPABASE_URL=PON_TU_URL_AQUI
VITE_SUPABASE_KEY=PON_TU_KEY_AQUI
EOF

# tailwind.config.js
echo "Creando tailwind.config.js..."
cat << 'EOF' > tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#475569',
      }
    },
  },
  plugins: [],
}
EOF

# postcss.config.js
echo "Creando postcss.config.js..."
cat << 'EOF' > postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# 3. Crear archivo CSS principal para Tailwind
echo "Creando src/index.css..."
cat << 'EOF' > src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# 4. Crear index.html (Punto de entrada de Vite)
echo "Creando index.html..."
cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>E-Commerce Store</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
EOF

# 5. Crear archivos de la aplicación

# src/types/index.ts
echo "Creando src/types/index.ts..."
cat << 'EOF' > src/types/index.ts
export interface Product {
  id: string;
  created_at: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  categoria: string | null;
}

export interface ProductFormData {
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string;
  imagen_url: string;
}
EOF

# src/supabase/client.ts
echo "Creando src/supabase/client.ts..."
cat << 'EOF' > src/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

// Acceso seguro a variables de entorno para evitar crasheos si faltan
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseKey = env.VITE_SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_KEY en el archivo .env');
}

// Bandera para verificar configuración en la UI
export const isSupabaseConfigured = supabaseUrl && supabaseKey && supabaseUrl !== 'PON_TU_URL_AQUI';

// Inicialización del cliente con fallbacks para evitar error fatal al inicio
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);
EOF

# src/components/ProtectedRoute.tsx
echo "Creando src/components/ProtectedRoute.tsx..."
cat << 'EOF' > src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
EOF

# src/pages/Home.tsx
echo "Creando src/pages/Home.tsx..."
cat << 'EOF' > src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Product } from '../types';
import { Search, Loader2, MessageCircle, AlertCircle } from 'lucide-react';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reemplaza esto con tu número real
  const WHATSAPP_NUMBER = "5551234567"; 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getWhatsAppLink = (productName: string) => {
    const message = `Hola, me interesa: ${productName}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Configuración Requerida</h2>
        <p className="text-gray-600 max-w-lg">
          No se ha detectado la configuración de Supabase. Por favor, configura las variables de entorno <code className="bg-gray-100 px-2 py-1 rounded text-sm text-primary">VITE_SUPABASE_URL</code> y <code className="bg-gray-100 px-2 py-1 rounded text-sm text-primary">VITE_SUPABASE_KEY</code> en tu archivo <code className="font-bold">.env</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo</h1>
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="h-48 w-full bg-gray-200 relative">
                  {product.imagen_url ? (
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Sin imagen
                    </div>
                  )}
                  {product.categoria && (
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {product.categoria}
                    </span>
                  )}
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[2.5rem]">
                    {product.descripcion || "Sin descripción disponible."}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(product.precio)}
                    </span>
                  </div>
                  
                  <a
                    href={getWhatsAppLink(product.nombre)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors font-medium"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Comprar
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No se encontraron productos que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
EOF

# src/pages/Login.tsx
echo "Creando src/pages/Login.tsx..."
cat << 'EOF' > src/pages/Login.tsx
import React, { useState } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';

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
      
      // Navigate to admin upon success
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Acceso Admin</h2>
          <p className="text-gray-500 text-sm">Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
EOF

# src/pages/Admin.tsx
echo "Creando src/pages/Admin.tsx..."
cat << 'EOF' > src/pages/Admin.tsx
import React, { useEffect, useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Product, ProductFormData } from '../types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Image as ImageIcon, 
  Loader2,
  UploadCloud 
} from 'lucide-react';

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const initialFormState: ProductFormData = {
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    imagen_url: ''
  };
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);
  const [showForm, setShowForm] = useState(false);
  
  // Upload State
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data } = supabase.storage
        .from('productos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, imagen_url: data.publicUrl }));
    } catch (error: any) {
      console.error('Error uploading image:', error.message || error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.precio) {
      alert('Nombre y Precio son obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        imagen_url: formData.imagen_url,
        categoria: formData.categoria
      };

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('productos')
          .update(productData)
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('productos')
          .insert([productData]);
        
        if (error) throw error;
      }

      await fetchProducts();
      resetForm();
    } catch (error: any) {
      console.error('Error saving product:', error.message || error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: product.precio.toString(),
      categoria: product.categoria || '',
      imagen_url: product.imagen_url || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Error deleting product:', error.message || error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nuevo Producto
          </button>
        )}
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-fade-in-down">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                <input
                  type="number"
                  name="precio"
                  step="0.01"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-grow">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-primary
                      hover:file:bg-blue-100"
                    disabled={uploading}
                  />
                </div>
                {uploading && (
                  <div className="flex items-center text-sm text-primary">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Subiendo...
                  </div>
                )}
              </div>
              
              {formData.imagen_url && (
                <div className="mt-2 relative inline-block">
                  <img 
                    src={formData.imagen_url} 
                    alt="Preview" 
                    className="h-32 w-32 object-cover rounded-md border"
                  />
                  <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{formData.imagen_url}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={resetForm}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 flex-shrink-0">
                      {product.imagen_url ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={product.imagen_url} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.descripcion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.precio}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.categoria || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No hay productos todavía. ¡Crea el primero!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
EOF

# src/App.tsx
echo "Creando src/App.tsx..."
cat << 'EOF' > src/App.tsx
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import { ShoppingBag, Lock, LogOut, Home as HomeIcon } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './supabase/client';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span>Store<span className="text-primary">X</span></span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`p-2 rounded-md ${location.pathname === '/' ? 'text-primary bg-blue-50' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <HomeIcon className="h-5 w-5" />
            </Link>
            
            {session ? (
              <>
                <Link 
                  to="/admin" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin' ? 'text-primary bg-blue-50' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                <Lock className="h-4 w-4" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
EOF

# src/index.tsx
echo "Creando src/index.tsx..."
cat << 'EOF' > src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Importante para Tailwind

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

echo "¡Estructura del proyecto creada exitosamente!"
echo "Pasos siguientes:"
echo "1. Ejecuta 'npm install' para instalar dependencias."
echo "2. Configura tu archivo .env con tus credenciales de Supabase."
echo "3. Ejecuta 'npm run dev' para iniciar el servidor."