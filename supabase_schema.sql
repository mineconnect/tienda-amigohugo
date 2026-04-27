-- =============================================
-- VHF Decants — Esquema de base de datos
-- Ejecutar en: Supabase → SQL Editor → New query
-- =============================================

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2) NOT NULL,
  image_url   TEXT,
  category    TEXT,
  notes       TEXT[],           -- Notas olfativas: ['Oud', 'Vainilla', 'Ámbar']
  size        TEXT,             -- Tamaño: '5ml', '10ml', '100ml'
  in_stock    BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública (todos pueden ver productos)
CREATE POLICY "Lectura pública de productos"
  ON products FOR SELECT
  USING (true);

-- Política: solo el service role puede escribir (admin)
-- Las escrituras se hacen desde el servidor con SUPABASE_SERVICE_ROLE_KEY
-- por lo que no necesitan política adicional (service role bypassa RLS)

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, image_url, category, notes, size, in_stock)
VALUES
  (
    'Oud Wood Decant',
    'Un decant del icónico Oud Wood de Tom Ford. Madera de oud suave y especiada con notas de madera de rosa y vetiver.',
    3500,
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
    'Eau de Parfum',
    ARRAY['Oud', 'Vetiver', 'Madera de Rosa'],
    '5ml',
    true
  ),
  (
    'Baccarat Rouge 540',
    'Decant del legendario Baccarat Rouge 540 de Maison Francis Kurkdjian. Jazmín, azafrán, cedro amaderado.',
    4200,
    'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80',
    'Eau de Parfum',
    ARRAY['Jazmín', 'Azafrán', 'Cedro'],
    '5ml',
    true
  ),
  (
    'Black Orchid',
    'Tom Ford Black Orchid. Trufa negra, ylang ylang, bergamota y vainilla oscura.',
    2800,
    'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=800&q=80',
    'Eau de Parfum',
    ARRAY['Trufa', 'Ylang Ylang', 'Vainilla'],
    '10ml',
    true
  );
