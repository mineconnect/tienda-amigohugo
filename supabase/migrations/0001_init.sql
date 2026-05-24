-- =====================================================
-- VHF Tienda — Schema inicial
-- Víctor Hugo Figueroa · Belén, Catamarca
-- Aplicar en Supabase → SQL Editor → New query
-- =====================================================

-- --------- categories ---------
CREATE TABLE IF NOT EXISTS public.categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  icon        text DEFAULT 'category',
  description text,
  sort_order  int  DEFAULT 0,
  active      bool DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- --------- products ---------
CREATE TABLE IF NOT EXISTS public.products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  description   text,
  price         numeric(10,2) NOT NULL CHECK (price >= 0),
  image_url     text,
  category_id   uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  size          text,
  color         text,
  stock_qty     int DEFAULT 0,
  in_stock      bool DEFAULT true,
  featured      bool DEFAULT false,
  sort_order    int  DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS products_in_stock_idx ON public.products(in_stock) WHERE in_stock = true;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- --------- site_settings ---------
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        text PRIMARY KEY,
  value      text,
  updated_at timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS site_settings_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- RLS — lectura pública, escritura solo service_role
-- =====================================================
ALTER TABLE public.categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read categories"    ON public.categories;
DROP POLICY IF EXISTS "public read products"      ON public.products;
DROP POLICY IF EXISTS "public read site_settings" ON public.site_settings;

CREATE POLICY "public read categories"    ON public.categories    FOR SELECT USING (true);
CREATE POLICY "public read products"      ON public.products      FOR SELECT USING (true);
CREATE POLICY "public read site_settings" ON public.site_settings FOR SELECT USING (true);
-- Writes: solo via service_role key (bypassa RLS)

-- =====================================================
-- Seed de categorías de ejemplo
-- =====================================================
INSERT INTO public.categories (slug, name, icon, description, sort_order) VALUES
  ('ropa',         'Ropa',         'checkroom',                'Camperas, camisas, jeans y más.',      1),
  ('calzado',      'Calzado',      'directions_walk',          'Zapatillas, botas y borcegos.',         2),
  ('bazar',        'Bazar',        'kitchen',                  'Vajilla, utensilios para tu cocina.',   3),
  ('hogar',        'Hogar',        'home',                     'Mantas, cortinas y deco.',              4),
  ('accesorios',   'Accesorios',   'watch',                    'Relojes, cinturones, gorros.',          5),
  ('bolsos',       'Bolsos',       'shopping_bag',             'Mochilas, carteras, bolsos.',           6),
  ('tecnologia',   'Tecnología',   'devices',                  'Auriculares, parlantes, gadgets.',      7),
  ('belleza',      'Belleza',      'face_retouching_natural',  'Perfumes y cuidado personal.',          8)
ON CONFLICT (slug) DO NOTHING;
