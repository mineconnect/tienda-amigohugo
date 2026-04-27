# VHF Decants — Guía de instalación completa

## Resumen de lo que vas a tener

- ✅ Página web en **Vercel** (gratis, siempre activa, nunca se pausa)
- ✅ Base de datos en **Supabase** (gratis, PostgreSQL en la nube)
- ✅ Panel administrador en `/admin` para agregar/editar/eliminar productos
- ✅ Carrito de compras → checkout por **WhatsApp** (+54 9 3834 78-9035)
- ✅ Cron job diario para mantener Supabase activo

---

## PASO 1 — Crear la base de datos en Supabase

1. Entrá a **https://supabase.com** y creá una cuenta gratuita (o iniciá sesión)
2. Hacé clic en **"New project"**
3. Completá:
   - **Name**: `vhf-decants`
   - **Database Password**: anotala, la vas a necesitar
   - **Region**: elegí **South America (São Paulo)** para mejor velocidad
4. Esperá ~2 minutos mientras se crea el proyecto
5. Una vez creado, andá al menú izquierdo → **SQL Editor** → **New query**
6. Pegá todo el contenido del archivo `supabase_schema.sql` y hacé clic en **Run**
7. Deberías ver "Success. No rows returned" — significa que la tabla se creó correctamente

### Obtener las claves de Supabase

1. En el menú izquierdo → **Settings** → **API**
2. Anotá estos tres valores:
   - **Project URL** (empieza con `https://`)
   - **anon public** (clave pública)
   - **service_role** (clave privada — ¡nunca la compartas!)

---

## PASO 2 — Subir el código a GitHub

1. Abrí **https://github.com** e iniciá sesión
2. Hacé clic en **"New repository"**
   - **Repository name**: `vhf-decants`
   - Dejalo en **Private** (más seguro)
   - No marques nada más → **"Create repository"**
3. En tu Mac, abrí **Terminal** y ejecutá estos comandos:

```bash
# Entrá a la carpeta del proyecto (la que te di)
cd ~/Downloads/vhf-decants   # o donde hayas guardado la carpeta

# Iniciá git y subí el código
git init
git add .
git commit -m "VHF Decants - primera versión"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/vhf-decants.git
git push -u origin main
```

> Reemplazá `TU_USUARIO` con tu nombre de usuario de GitHub

---

## PASO 3 — Desplegar en Vercel

1. Entrá a **https://vercel.com** y creá una cuenta con tu cuenta de GitHub
2. Hacé clic en **"Add New Project"**
3. Buscá y seleccioná el repositorio `vhf-decants`
4. En la sección **"Environment Variables"**, agregá estas variables una por una:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | La URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La clave `anon public` de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | La clave `service_role` de Supabase |
| `ADMIN_PASSWORD` | La contraseña que quieras para el admin (ej: `VHF2024Admin!`) |
| `ADMIN_JWT_SECRET` | Una cadena aleatoria larga (ej: `vhf-secret-key-muy-larga-2024-abc`) |

5. Hacé clic en **"Deploy"**
6. Esperá 2-3 minutos mientras Vercel construye el proyecto
7. ¡Listo! Tu sitio estará en `https://vhf-decants.vercel.app`

---

## PASO 4 — Conectar tu dominio existente (vhfdecants.vercel.app)

Como ya tenés el proyecto en Vercel:
1. En Vercel → tu proyecto → **Settings** → **Domains**
2. El dominio `vhfdecants.vercel.app` ya debería estar asignado automáticamente

---

## PASO 5 — Usar el panel de administrador

1. Entrá a: `https://vhfdecants.vercel.app/admin`
2. Ingresá la contraseña que configuraste en `ADMIN_PASSWORD`
3. Desde ahí podés:
   - ➕ **Agregar** nuevos productos (nombre, precio, tamaño, notas, imagen, categoría)
   - ✏️ **Editar** cualquier producto existente
   - 🗑️ **Eliminar** productos
   - 🔄 **Activar/desactivar** stock de cada producto

### ¿Cómo pongo imágenes a los productos?

Tenés dos opciones:
- **Opción A (más fácil)**: Subí la foto a [imgbb.com](https://imgbb.com) o [imgur.com](https://imgur.com) gratis, y pegá el link directo de la imagen en el campo "URL de imagen"
- **Opción B**: Usá cualquier link de imagen de internet (que sea público)

---

## Cómo funciona el carrito → WhatsApp

1. El cliente navega la tienda y agrega productos al carrito
2. Hace clic en **"Comprar por WhatsApp"**
3. Se abre WhatsApp con un mensaje pre-armado así:

```
Hola! Quiero hacer el siguiente pedido:

• Oud Wood Decant (5ml) — $3.500 x1
• Baccarat Rouge 540 (5ml) — $4.200 x2

Total: $11.900

Aguardo tu respuesta para coordinar el envío. ¡Gracias!
```

4. El cliente solo tiene que tocar **Enviar** y vos recibís el pedido

---

## ¿Se puede caer la base de datos?

**No.** Se configuró un cron job en Vercel que le manda un "ping" a la base de datos todos los días al mediodía. Esto evita que Supabase ponga en pausa el proyecto por inactividad.

Además, Vercel (el hosting) **nunca se pausa** en el plan gratuito.

---

## Actualizaciones futuras

Si en el futuro querés cambiar algo del código:
1. Modificá los archivos en tu carpeta local
2. En Terminal:
```bash
git add .
git commit -m "descripción del cambio"
git push
```
3. Vercel detecta el cambio y actualiza el sitio automáticamente en ~2 minutos

---

## URLs importantes

| Qué | URL |
|-----|-----|
| Tienda | `https://vhfdecants.vercel.app` |
| Panel admin | `https://vhfdecants.vercel.app/admin` |
| Dashboard admin | `https://vhfdecants.vercel.app/admin/dashboard` |
| Supabase | `https://app.supabase.com` |
| Vercel | `https://vercel.com` |
