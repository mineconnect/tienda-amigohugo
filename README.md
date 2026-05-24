# VHF — Importaciones de Belén

Tienda online de **Víctor Hugo Figueroa** (Belén, Catamarca) — productos seleccionados personalmente. Checkout 100% por WhatsApp; sin pasarela de pago en el sitio.

## Stack

- **Next.js 14** (App Router, RSC)
- **Supabase** (Postgres + Auth + RLS)
- **Vercel** (hosting + cron job para mantener la DB despierta)
- **Tailwind CSS** + Cormorant Garamond / Inter Tight
- **Jest** para tests

## Setup en 5 pasos

### 1. Base de datos (Supabase)

Si todavía no tenés la base lista, andá a [Supabase](https://app.supabase.com) y aplicá la migration que está en `supabase/migrations/0001_init.sql`. Si ya está creada, salteá este paso.

En **Settings → API** anotá:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY` (¡nunca exponer!)

### 2. Variables de entorno en Vercel

En Vercel → Settings → Environment Variables, agregá **solo estas 3 secretas** (la URL pública y la anon key tienen defaults bakeados en el código — son claves públicas por diseño):

| Variable | Cómo se genera |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | De Supabase → Settings → API (¡secret!) |
| `ADMIN_EMAIL` | El correo del admin (ej: `hugo@vhfbelen.com.ar`) |
| `ADMIN_PASSWORD` | Contraseña fuerte (12+ caracteres) |
| `ADMIN_JWT_SECRET` | `openssl rand -base64 48` (mín. 32 caracteres) |

Si querés usar OTRO proyecto Supabase (no el default), seteá también `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` para sobrescribir.

### 3. Deploy

Vercel detecta cualquier push a `main` y despliega automáticamente. La home queda en `https://vhfdecants.vercel.app/` (o el dominio que configures).

### 4. Cargar productos

1. Andá a `/admin` y entrá con `ADMIN_EMAIL` + `ADMIN_PASSWORD`.
2. En la solapa **Categorías** revisá las que vienen pre-cargadas y editá lo que quieras.
3. En la solapa **Productos** subí los artículos: nombre, precio, foto (URL o desde tu compu), talle, color, stock.
4. En la solapa **Sitio** podés editar todos los textos de la home, contacto, beneficios, etc.

### 5. La DB no se cae

Vercel tiene configurado un **cron job diario** (`vercel.json` → `/api/ping`) que mantiene Supabase despierta. El plan free de Supabase pausa proyectos sin actividad por 7 días — el ping lo evita.

## Desarrollo local

```bash
npm install
cp .env.example .env.local
# completá .env.local con tus valores
npm run dev
```

## Tests

```bash
npm test
```

Cubre la lógica del carrito (`lib/cart.ts`) y la autenticación (`lib/auth.ts`).

## Estructura

```
app/
├── page.tsx                  # Home con catálogo + categorías + about
├── producto/[id]/            # Detalle de producto
├── cart/                     # Carrito + checkout WhatsApp
├── sobre-nosotros/           # Historia de Víctor Hugo
├── faq/                      # Preguntas frecuentes
├── terminos/                 # Términos y privacidad
├── admin/
│   ├── page.tsx              # Login
│   └── dashboard/            # Panel con 3 tabs (Productos, Categorías, Sitio)
└── api/
    ├── ping/                 # Cron Vercel → mantiene Supabase activo
    ├── categories/           # GET público
    └── admin/                # Login, productos, categorías, settings (protegidos)
```

## Auditoría de seguridad — checklist

- ✅ `ADMIN_PASSWORD` comparado con `crypto.timingSafeEqual` (resistente a timing attacks)
- ✅ `ADMIN_JWT_SECRET` obligatorio (sin fallback hardcodeado)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` solo en server (nunca expuesta al navegador)
- ✅ Middleware protege TODOS los `/api/admin/*` (excepto `/login` y `/logout`)
- ✅ Cookie `admin_token` con `httpOnly`, `secure`, `sameSite: strict`
- ✅ RLS habilitado en `products`, `categories`, `site_settings` — lectura pública, escritura solo service role
- ✅ Validación server-side de inputs (longitudes, números, slug pattern)
- ✅ Sin pasarela de pago → no manejamos datos sensibles de tarjetas

## Soporte

Cualquier consulta técnica, escribir a [hola@vhfbelen.com.ar](mailto:hola@vhfbelen.com.ar) o por [WhatsApp](https://wa.me/5493834789035).
