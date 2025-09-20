#!/usr/bin/env bash
set -euo pipefail

section(){ printf "\n=== %s ===\n" "$1"; }

section "ENV"
node -v; npm -v

section "WORKSPACES"
jq -r '.name,.workspaces // []' package.json || true

section "SCRIPTS"
jq -r '.scripts // {}' package.json || true
jq -e '.scripts["build:dev"]' package.json >/dev/null 2>&1 || echo "WARN: build:dev missing"

section "TS CONFIG BLEED"
grep -R --line-number '"vite/client"' tsconfig*.json 2>/dev/null || echo "OK: no root vite/client"

section "DEPENDENCY INSTALL"
npm ci --legacy-peer-deps

section "TYPECHECK"
npx tsc --noEmit --project .

section "LINT (summary)"
if npm run -s lint >/dev/null 2>&1; then
  npm run -s lint || true
else
  echo "INFO: no lint script"
fi

section "BUILD"
npm run build

section "EDGE FUNCTIONS"
if [ -d supabase/functions ]; then
  find supabase/functions -maxdepth 2 -name index.ts -print | sed 's/^/FUNC: /'
  if command -v deno >/dev/null 2>&1; then
    (cd supabase/functions && deno check **/*.ts || true)
  else
    echo "WARN: deno not installed"
  fi
else
  echo "WARN: supabase/functions not found"
fi

section "ENV VARS"
ls -1a .env* 2>/dev/null || echo "WARN: no .env files"
grep -E 'VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY|SUPABASE_URL|SUPABASE_ANON_KEY|OPENAI_API_KEY' .env* 2>/dev/null || true

section "DUP TYPES: MarketListing"
grep -R --line-number -E 'interface +MarketListing|type +MarketListing' src apps packages 2>/dev/null || echo "OK: none found"

section "DUP ENGINES"
grep -R --line-number -E 'processValuation|runValuation|ValuationEngine' src apps packages 2>/dev/null || echo "INFO: none found"

section "SIMILAR LISTINGS COMPONENT"
grep -R --line-number 'SimilarListingsSection' src apps packages 2>/dev/null || echo "INFO: not found"

section "COMMON OPENAI HEADER BUG"
grep -R --line-number 'Authorization": `Bearer .*"' supabase/functions 2>/dev/null && echo "WARN: bad quote in Authorization header"

section "SUMMARY"
echo "All WARN/ERROR above must be zero before ship."
