#!/usr/bin/env bash
# =====================================================
# Setup automático de Vercel para VHF Tienda
#
# Setea las 4 env vars secretas y dispara un redeploy.
# Correlo desde tu Mac/PC (no desde el contenedor de Claude):
#
#   bash scripts/setup-vercel.sh
#
# O directo desde GitHub:
#
#   curl -fsSL https://raw.githubusercontent.com/mineconnect/tienda-amigohugo/main/scripts/setup-vercel.sh | bash
#
# Necesitás un Vercel API Token. Generalo en 30 seg:
#   https://vercel.com/account/tokens → Create → Scope: "Facundo's projects"
# =====================================================

set -euo pipefail

# ----- Config (proyecto VHF, podés sobreescribir vía env) -----
PROJECT_ID="${PROJECT_ID:-prj_HO06WJzYyQMwZZBM3SsLqUuTTaKe}"
TEAM_ID="${TEAM_ID:-team_S8eJgKsO9PkTc62ubPU9RYC1}"

SUPABASE_SERVICE_ROLE_KEY_VAL="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6dmZ5ZGtxcGtjcWZudXV5YWd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUwNjE1NSwiZXhwIjoyMDk0MDgyMTU1fQ.sxPnt0N_3Pz_ViwLXs3EvA6XP323-OBYh4djkSOfz30"
ADMIN_EMAIL_VAL="${ADMIN_EMAIL_VAL:-victorhugo@vhfbelen.com.ar}"
ADMIN_PASSWORD_VAL="${ADMIN_PASSWORD_VAL:-T8hiJ0AgI4uWuMzLxgqk}"
ADMIN_JWT_SECRET_VAL="${ADMIN_JWT_SECRET_VAL:-cQRCTXimp63NJaRGVyIcE1crFzk3i3NjYCtJba/lopD3J0LceISPNdx/MzU+0hft}"

# ----- Token de Vercel -----
if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "🔑 Necesito tu Vercel API Token (no se guarda en ningún lado)."
  echo "   Generalo en https://vercel.com/account/tokens"
  echo -n "   Pegalo acá y dale Enter: "
  read -rs VERCEL_TOKEN
  echo
fi

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "❌ Sin token no puedo continuar."
  exit 1
fi

API="https://api.vercel.com"
AUTH="Authorization: Bearer ${VERCEL_TOKEN}"

echo "🔍 Validando token..."
WHO=$(curl -fsS -H "$AUTH" "$API/v2/user" 2>&1) || {
  echo "❌ Token inválido o sin permisos."; exit 1;
}
USER=$(echo "$WHO" | grep -o '"username":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "   ✓ Autenticado como: $USER"

# ----- Función para setear UNA env var (upsert) -----
set_env() {
  local key="$1"
  local value="$2"
  local type="$3"   # "encrypted" (secreto) o "plain"

  # Borramos primero por las dudas (POST con upsert=true a veces falla si ya existe)
  curl -s -o /dev/null -X DELETE -H "$AUTH" \
    "$API/v9/projects/${PROJECT_ID}/env/${key}?teamId=${TEAM_ID}" || true

  # Creamos
  local body
  body=$(cat <<EOF
{
  "key": "$key",
  "value": $(printf '%s' "$value" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
  "type": "$type",
  "target": ["production", "preview", "development"]
}
EOF
)

  local resp
  resp=$(curl -fsS -X POST -H "$AUTH" -H "Content-Type: application/json" \
    -d "$body" \
    "$API/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true" 2>&1) || {
    echo "   ❌ Falló al setear $key"
    echo "      $resp"
    return 1
  }
  echo "   ✓ $key"
}

echo "⚙️  Seteando 4 env vars en production + preview + development..."
set_env "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY_VAL" "encrypted"
set_env "ADMIN_EMAIL"                "$ADMIN_EMAIL_VAL"                "encrypted"
set_env "ADMIN_PASSWORD"             "$ADMIN_PASSWORD_VAL"             "encrypted"
set_env "ADMIN_JWT_SECRET"           "$ADMIN_JWT_SECRET_VAL"           "encrypted"

echo ""
echo "🚀 Disparando redeploy del último commit de main..."

# Obtenemos el último deployment para tener el GitHub commit SHA
LAST_DEPLOY=$(curl -fsS -H "$AUTH" \
  "$API/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&limit=1&target=production" \
  | python3 -c 'import sys,json; d=json.load(sys.stdin)["deployments"][0]; print(d["uid"])')

# Re-deploy con build cache desactivado
REDEPLOY=$(curl -fsS -X POST -H "$AUTH" -H "Content-Type: application/json" \
  "$API/v13/deployments?teamId=${TEAM_ID}&forceNew=1" \
  -d "{\"name\":\"vhfdecants\",\"deploymentId\":\"${LAST_DEPLOY}\",\"target\":\"production\"}" 2>&1) || {
  echo "❌ No pude disparar el redeploy directo. Hacelo manual:"
  echo "   https://vercel.com/${USER}/vhfdecants/deployments"
  echo "   → último deploy → ⋯ → Redeploy"
  exit 1
}

NEW_URL=$(echo "$REDEPLOY" | python3 -c 'import sys,json; d=json.load(sys.stdin); print("https://"+d.get("url",""))' 2>/dev/null || echo "")
echo "   ✓ Redeploy disparado: $NEW_URL"

echo ""
echo "✅ Listo. En 2-3 minutos chequeá:"
echo "   • Tienda → https://vhfdecants.vercel.app/"
echo "   • Admin → https://vhfdecants.vercel.app/admin"
echo "     Email:    $ADMIN_EMAIL_VAL"
echo "     Password: $ADMIN_PASSWORD_VAL"
echo ""
echo "Si la integración Git→Vercel sigue rota, los pushes futuros no van"
echo "a disparar deploy automático. Andá a Settings → Git → Reconnect."
