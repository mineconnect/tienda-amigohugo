-- ==========================================
-- POLÍTICAS DE SEGURIDAD PARA STORAGE (RLS)
-- ==========================================

-- 1. Crear el bucket 'productos' si no existe
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- 2. Habilitar RLS en objetos (por si no está activo)
alter table storage.objects enable row level security;

-- 3. Limpiar políticas viejas para evitar conflictos
drop policy if exists "Public Access Select" on storage.objects;
drop policy if exists "Authenticated Access Insert" on storage.objects;
drop policy if exists "Authenticated Access Update" on storage.objects;
drop policy if exists "Authenticated Access Delete" on storage.objects;

-- 4. Permitir que CUALQUIERA pueda VER las imágenes (Público)
create policy "Public Access Select"
  on storage.objects for select
  using ( bucket_id = 'productos' );

-- 5. Permitir que SOLO usuarios LOGUEADOS puedan SUBIR imágenes
create policy "Authenticated Access Insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'productos' );

-- 6. Permitir que SOLO usuarios LOGUEADOS puedan ACTUALIZAR imágenes
create policy "Authenticated Access Update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'productos' );

-- 7. Permitir que SOLO usuarios LOGUEADOS puedan BORRAR imágenes
create policy "Authenticated Access Delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'productos' );
