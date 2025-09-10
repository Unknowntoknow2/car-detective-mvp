#!/usr/bin/env bash
set -euo pipefail

# --- Setup ---
TS=$(date +"%Y%m%d_%H%M%S")
LOG_DIR="logs"
LOG_FILE="$LOG_DIR/step3_cleanup_$TS.log"
mkdir -p "$LOG_DIR" src/_archive/services src/_archive/components

exec > >(tee -i "$LOG_FILE") 2>&1

echo "=== Step 3 Cleanup Audit Started at $TS ==="

# --- Step 1: Locate Valuation Engine Variants ---
echo "--- Finding all valuation engine files ---"
find src/services -type f -iname "*ValuationEngine*.ts" || true

echo "--- Grepping for legacy imports ---"
grep -R "ValuationEngine" src/ --exclude="valuationEngine.ts" || true

# --- Step 2: Archive Legacy Engines ---
echo "--- Archiving legacy valuation engines ---"
for f in ValuationEngine.ts resilientValuationEngine.ts unifiedValuationEngine.ts; do
  if [[ -f "src/services/$f" ]]; then
    read -p "Archive $f? [y/N] " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
      git mv "src/services/$f" "src/_archive/services/$f"
      echo "Archived $f"
    else
      echo "Skipped $f"
    fi
  fi
done

# --- Step 3: Fix Imports ---
echo "--- Replacing imports with canonical valuationEngine ---"
grep -Rl "from '.*ValuationEngine" src/ | while read -r file; do
  sed -i "s|from '.*ValuationEngine'|from '@/services/valuationEngine'|g" "$file"
  echo "Fixed import in $file"
done

# --- Step 4: Verify Canonical Engine Only ---
echo "--- Verifying only canonical valuationEngine.ts remains ---"
grep -R "ValuationEngine" src/ --exclude-dir=_archive || true

# --- Step 5: Results Renderer Cleanup ---
echo "--- Checking for duplicate ValuationResults components ---"
find src/components -type f -iname "ValuationResults*.tsx" || true

grep -R "ValuationResults" src/ --exclude="ValuationResultsDisplay.tsx" || true

if [[ -f "src/components/result/ValuationResults.tsx" ]]; then
  read -p "Archive ValuationResults.tsx? [y/N] " confirm
  if [[ "$confirm" =~ ^[Yy]$ ]]; then
    git mv src/components/result/ValuationResults.tsx src/_archive/components/ValuationResults.tsx
    echo "Archived duplicate ValuationResults.tsx"
  else
    echo "Skipped ValuationResults.tsx"
  fi
fi

# --- Step 6: Router Check ---
echo "--- Ensuring only ValuationResultsDisplay is routed ---"
grep -R "ValuationResults" src/App.tsx || true

# --- Step 7: TypeScript + Test Proof ---
echo "--- Running TypeScript strict check ---"
npx tsc --noEmit --strict

echo "--- Running valuation test harness ---"
npx tsx valuation_test_run.ts

echo "=== Step 3 Cleanup Audit Completed Successfully ==="
echo "Log saved to $LOG_FILE"
