#!/bin/bash
BASE="${1:-http://localhost:54321/functions/v1}"
VIN="5YFB4MDE8SP33B447"
curl -s -X POST "$BASE/iihs" -H 'Content-Type: application/json' -d "{\"vin\":\"$VIN\"}" | jq
