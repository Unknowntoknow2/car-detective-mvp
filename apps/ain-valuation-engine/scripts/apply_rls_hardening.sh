#!/bin/bash
# Google-level automation: Apply RLS hardening migration to staging and production
# Usage: ./scripts/apply_rls_hardening.sh <STAGING_DB_URL> <PROD_DB_URL>

set -euo pipefail

STAGING_DB=${1:-$STAGING_DB}
PROD_DB=${2:-$PROD_DB}
MIGRATION_FILE="supabase/migrations/20250822_rls_hardening.sql"

if [[ -z "$STAGING_DB" || -z "$PROD_DB" ]]; then
  echo "Usage: $0 <STAGING_DB_URL> <PROD_DB_URL>"
  exit 1
fi

# Apply to staging
echo "[INFO] Applying migration to STAGING..."
supabase migration up --db-url "$STAGING_DB"

# Lint after staging
echo "[INFO] Linting STAGING DB..."
supabase db lint --db-url "$STAGING_DB"

# Apply to production
echo "[INFO] Applying migration to PRODUCTION..."
supabase migration up --db-url "$PROD_DB"

echo "[SUCCESS] RLS hardening migration applied to both environments."
