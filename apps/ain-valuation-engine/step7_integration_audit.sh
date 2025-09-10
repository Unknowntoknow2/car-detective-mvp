#!/bin/bash
set -euo pipefail

timestamp=$(date +"%Y%m%d_%H%M%S")
log_dir="logs"
log_file="$log_dir/step7_integration_audit_$timestamp.log"

mkdir -p "$log_dir"

echo "=== Step 7 Integration Audit Started at $timestamp ===" | tee -a "$log_file"

# 1. End-to-End Data Path Audit
echo "--- End-to-end data path: VIN → decode → valuationEngine → SHAP → ValuationResultsDisplay ---" | tee -a "$log_file"
# Simulate a real valuation flow (mock or CLI test)
if npx tsx valuation_test_run.ts >> "$log_file" 2>&1; then
  echo "Valuation test run passed ✅" | tee -a "$log_file"
else
  echo "Valuation test run FAILED ❌" | tee -a "$log_file"
  exit 1
fi

# 2. Cross-Boundary Imports
echo "--- Checking for stray imports from ValuationTypes.ts ---" | tee -a "$log_file"
grep -R "@/types/ValuationTypes" src/ | tee -a "$log_file"

echo "--- Checking for VehicleDataForValuation schema usage ---" | tee -a "$log_file"
grep -R "VehicleDataForValuation" src/ | tee -a "$log_file"

# 3. Production-Grade Routes
echo "--- Auditing App.tsx/router for dead/demo/duplicate routes ---" | tee -a "$log_file"
grep -R "Route" src/App.tsx | tee -a "$log_file"
grep -R "valuation" src/App.tsx | tee -a "$log_file"

# 4. Feature Completeness
echo "--- Checking for PDF Export, Share Links, Confidence Score, Market Listings ---" | tee -a "$log_file"
grep -R "pdf" src/components/ | tee -a "$log_file"
grep -R "share" src/components/ | tee -a "$log_file"
grep -R "confidence" src/components/ | tee -a "$log_file"
grep -R "market" src/components/ | tee -a "$log_file"

# 5. Runtime Resilience (Smoke Test)
echo "--- Running smoke tests for all flows (VIN, plate, manual, follow-up, PDF, share) ---" | tee -a "$log_file"
# (Assume CLI or test scripts exist for each; if not, log as TODO)
for flow in vin plate manual followup pdf share; do
  if [ -f "smoke_tests/${flow}_smoke_test.ts" ]; then
    if npx tsx smoke_tests/${flow}_smoke_test.ts >> "$log_file" 2>&1; then
      echo "${flow^} smoke test passed ✅" | tee -a "$log_file"
    else
      echo "${flow^} smoke test FAILED ❌" | tee -a "$log_file"
      exit 1
    fi
  else
    echo "TODO: No smoke test found for $flow flow." | tee -a "$log_file"
  fi
done

# 6. Final Strict/Functional Double Check
echo "--- Running TypeScript strict check ---" | tee -a "$log_file"
if npx tsc --noEmit --strict >> "$log_file" 2>&1; then
  echo "TypeScript strict check passed ✅" | tee -a "$log_file"
else
  echo "TypeScript strict check FAILED ❌" | tee -a "$log_file"
  exit 1
fi

echo "=== Step 7 Integration Audit Completed at $(date +"%Y%m%d_%H%M%S") ===" | tee -a "$log_file"
