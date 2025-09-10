#!/bin/bash
set -euo pipefail

timestamp=$(date +"%Y%m%d_%H%M%S")
log_dir="logs"
log_file="$log_dir/step6_flow_audit_$timestamp.log"

mkdir -p "$log_dir"

echo "=== Step 6 Flow Audit Started at $timestamp ===" | tee -a "$log_file"

# 1. Page-Level Entry Points
echo "--- Scanning pages for valuation entry points ---" | tee -a "$log_file"
grep -R "Valuation" src/pages/ | tee -a "$log_file" || echo "No valuation references found in pages." | tee -a "$log_file"

# 2. Flow Wiring Check
echo "--- Checking for canonical valuationEngine usage in pages ---" | tee -a "$log_file"
grep -R "valuationEngine" src/pages/ | tee -a "$log_file" || echo "No direct valuationEngine references in pages." | tee -a "$log_file"

echo "--- Grepping for legacy functions (runValuation, ValuationEngine, resilientValuationEngine, unifiedValuationEngine) ---" | tee -a "$log_file"
grep -R "runValuation" src/pages/ || echo "No runValuation found in pages." | tee -a "$log_file"
grep -R "ValuationEngine" src/pages/ || echo "No ValuationEngine found in pages." | tee -a "$log_file"
grep -R "resilientValuationEngine" src/pages/ || echo "No resilientValuationEngine found in pages." | tee -a "$log_file"
grep -R "unifiedValuationEngine" src/pages/ || echo "No unifiedValuationEngine found in pages." | tee -a "$log_file"

# 3. Follow-Up Flow Audit
echo "--- Scanning followup components for ValuationResult imports ---" | tee -a "$log_file"
grep -R "ValuationResult" src/components/followup/ | tee -a "$log_file" || echo "No ValuationResult imports found in followup components." | tee -a "$log_file"

# 4. Route Integrity Check
echo "--- Checking routes in App.tsx for valuation pages ---" | tee -a "$log_file"
grep -R "Route" src/App.tsx | tee -a "$log_file"
grep -R "valuation" src/App.tsx | tee -a "$log_file"

# 5. TypeScript Strict Check
echo "--- Running TypeScript strict check ---" | tee -a "$log_file"
if npx tsc --noEmit --strict >> "$log_file" 2>&1; then
  echo "TypeScript strict check passed ✅" | tee -a "$log_file"
else
  echo "TypeScript strict check FAILED ❌" | tee -a "$log_file"
  exit 1
fi

# 6. Functional Valuation Test
echo "--- Running valuation_test_run.ts to validate end-to-end flow ---" | tee -a "$log_file"
if npx tsx valuation_test_run.ts >> "$log_file" 2>&1; then
  echo "Valuation test run passed ✅" | tee -a "$log_file"
else
  echo "Valuation test run FAILED ❌" | tee -a "$log_file"
  exit 1
fi

echo "=== Step 6 Flow Audit Completed at $(date +"%Y%m%d_%H%M%S") ===" | tee -a "$log_file"
