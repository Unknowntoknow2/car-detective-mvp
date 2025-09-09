#!/bin/bash

# CI Guard: Prevent direct imports of RealValuationEngine outside unified entry point
echo "🔍 Checking for unauthorized RealValuationEngine imports..."

# Search for imports of realValuationEngine outside the canonical entry point
unauthorized_imports=$(rg -n "from '@/services/valuation/realValuationEngine'" src \
 | rg -v "src/services/valuation/valuationEngine.ts")

if [ -n "$unauthorized_imports" ]; then
  echo "❌ ERROR: Direct imports of RealValuationEngine detected outside unified entry point:"
  echo "$unauthorized_imports"
  echo ""
  echo "Only src/services/valuation/valuationEngine.ts should import RealValuationEngine directly."
  echo "All other code should use calculateUnifiedValuation() instead."
  exit 1
else
  echo "✅ PASS: No unauthorized RealValuationEngine imports found"
  exit 0
fi