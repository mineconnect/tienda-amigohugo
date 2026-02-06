import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import type { Producto } from '../types';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary min-h-screen text-white">
      <Header cartCount={0} />

      <main>
        <Hero />
        <ProductGrid products={products} loading={loading} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;