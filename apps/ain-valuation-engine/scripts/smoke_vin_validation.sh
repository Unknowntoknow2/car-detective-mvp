#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-http://localhost:54321/functions/v1}"
function hit() {
  local VIN="$1"
  echo -e "\n--- VIN: $VIN"
  curl -s -X POST "$BASE/vin-validate" \
    -H "Content-Type: application/json" \
    -d "{\"vin\":\"$VIN\"}" | jq
}
# Valid
hit "1HGCM82633A004352"
hit "5YJ3E1EA7HF000337"
hit "JHMCM56557C404453"
# Invalid (format)
hit "1HGCM82633A00435"
hit "1HGCM82633A00I352"
# Invalid (check digit) -> flip 9th char on a valid VIN
hit "1HGCM826X3A004352"
