#!/usr/bin/env bash
set -euo pipefail
ROOT="supabase/functions"
LATEST_STD="0.224.0"
HTTP_IMPORT_REGEX='from "https://deno.land/std@[^"]+/http/server.ts"'
TARGETS=$(grep -RIlE "$HTTP_IMPORT_REGEX" "$ROOT" || true)
if [[ -z "$TARGETS" ]]; then echo "No legacy std/http/server imports found."; exit 0; fi
for f in $TARGETS; do
  cp "$f" "${f}.bak.$(date +%s)"
  sed -i'' -E 's@^import[[:space:]]*\{[[:space:]]*serve[[:space:]]*(as[[:space:]]*[a-zA-Z_][a-zA-Z0-9_]*)?[[:space:]]*\}[[:space:]]*from[[:space:]]*"https://deno.land/std@[^"]+/http/server.ts";?[[:space:]]*$@@' "$f"
  sed -i'' -E 's/([^A-Za-z0-9_])serve\(/\\1Deno.serve(/g' "$f"
  sed -i'' -E "s@https://deno.land/std@https://deno.land/std@${LATEST_STD}@g" "$f"
  echo "Migrated: $f"
done
echo "Validate with:
  deno lint supabase/functions
  deno check \$(git -C supabase/functions ls-files \"*.ts\" \"*.tsx\")"
