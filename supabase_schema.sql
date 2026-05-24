-- =============================================
-- VHF Decants — Esquema de base de datos
-- Ejecutar en: Supabase → SQL Editor → New query
-- =============================================

-- SI YA TIENES LA TABLA, EJECUTA ESTO PRIMERO:
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2) NOT NULL,
  image_url   TEXT,
  category    TEXT,             -- 'Niche', 'Designer', 'Árabes', 'Editorial'
  notes       TEXT[],           -- Notas olfativas: ['Oud', 'Vainilla', 'Ámbar']
  size        TEXT,             -- Tamaño: '5ml', '10ml', '30ml'
  in_stock    BOOLEAN DEFAULT true,
  featured    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública (todos pueden ver productos)
DROP POLICY IF EXISTS "Lectura pública de productos" ON products;
CREATE POLICY "Lectura pública de productos"
  ON products FOR SELECT
  USING (true);

-- =============================================
-- Productos de ejemplo (representativos del catálogo)
-- =============================================

INSERT INTO products (name, description, price, image_url, category, notes, size, in_stock, featured)
VALUES
  (
    'Oud Wood',
    'El icónico Oud Wood de Tom Ford. Madera de oud suave y especiada, sándalo y palo de rosa sobre una base ahumada de vetiver y ámbar. Elegante, atemporal, unisex.',
    3500,
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=80',
    'Niche',
    ARRAY['Oud', 'Palo de Rosa', 'Vetiver', 'Sándalo', 'Ámbar'],
    '5ml',
    true,
    true
  ),
  (
    'Baccarat Rouge 540',
    'El legendario Baccarat Rouge 540 de Maison Francis Kurkdjian. Azafrán y jazmín envueltos en cedro amaderado y ámbar mineral. Una firma olfativa irrepetible.',
    4200,
    'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=80',
    'Niche',
    ARRAY['Azafrán', 'Jazmín', 'Cedro', 'Ámbar Gris'],
    '5ml',
    true,
    true
  ),
  (
    'Grand Soir',
    'Maison Francis Kurkdjian Grand Soir. Vainilla bourbon, ámbar, benjuí y haba tonka. Una velada parisina embotellada — caluroso, envolvente, magnético.',
    4500,
    'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=900&q=80',
    'Niche',
    ARRAY['Vainilla', 'Ámbar', 'Benjuí', 'Haba Tonka'],
    '5ml',
    true,
    true
  ),
  (
    'Black Orchid',
    'Tom Ford Black Orchid. Trufa negra, ylang ylang, bergamota y vainilla oscura. Misterioso, sensual y reconocible al instante.',
    2800,
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80',
    'Designer',
    ARRAY['Trufa Negra', 'Ylang Ylang', 'Vainilla', 'Pachulí'],
    '10ml',
    true,
    true
  ),
  (
    'Sauvage Elixir',
    'Dior Sauvage Elixir. Especias cálidas, lavanda, regaliz y madera de licorice. Versión concentrada y nocturna del clásico — más oscuro, más denso.',
    3200,
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80',
    'Designer',
    ARRAY['Canela', 'Lavanda', 'Regaliz', 'Sándalo'],
    '5ml',
    true,
    false
  ),
  (
    'Bleu de Chanel Parfum',
    'Chanel Bleu de Chanel Parfum. Cítricos frescos, sándalo cremoso y notas amaderadas profundas. El éxito comercial mejor logrado de la última década.',
    3000,
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=80',
    'Designer',
    ARRAY['Bergamota', 'Sándalo', 'Cedro', 'Incienso'],
    '5ml',
    true,
    false
  ),
  (
    'Khamrah',
    'Lattafa Khamrah. Canela, dátiles maduros, vainilla cremosa y mirra. Goloso y especiado — un postre oriental con presencia descomunal.',
    1800,
    'https://images.unsplash.com/photo-1610461888750-10bfc601b874?w=900&q=80',
    'Árabes',
    ARRAY['Canela', 'Dátiles', 'Vainilla', 'Mirra'],
    '5ml',
    true,
    true
  ),
  (
    'Asad',
    'Lattafa Asad. Oud, agarwood y notas amaderadas profundas con un toque de azafrán. El rugido del león — fuerte, dominante, oriental clásico.',
    1600,
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80',
    'Árabes',
    ARRAY['Oud', 'Agarwood', 'Azafrán', 'Cuero'],
    '5ml',
    true,
    false
  );
