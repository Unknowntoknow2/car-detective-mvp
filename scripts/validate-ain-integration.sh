#!/bin/bash
# AIN Integration Validation Script

echo "🔍 Validating AIN-only integration..."

# 1. Check for any remaining fallback code
echo "1️⃣ Checking for fallback code..."
if grep -r "calculateUnifiedValuation\|RealValuationEngine\|ain\.fallback\.used" src/ 2>/dev/null; then
  echo "❌ FAIL: Found fallback code in src/"
  exit 1
else
  echo "✅ PASS: No fallback code found"
fi

# 2. Check for correct import paths
echo "2️⃣ Checking import paths..."
if grep -r "from.*@/context/ValuationContext" src/ 2>/dev/null; then
  echo "❌ FAIL: Found incorrect context import path"
  exit 1
else
  echo "✅ PASS: All context imports use correct path (@/contexts/ValuationContext)"
fi

# 3. Check AIN client exists and is properly configured
echo "3️⃣ Checking AIN client..."
if [ -f "src/lib/ainClient.ts" ]; then
  echo "✅ PASS: AIN client exists"
  
  # Check for proper type definitions
  if grep -q "AinResponse\|AinMeta" src/lib/ainClient.ts; then
    echo "✅ PASS: AIN client has proper types"
  else
    echo "❌ FAIL: AIN client missing type definitions"
    exit 1
  fi
else
  echo "❌ FAIL: AIN client not found"
  exit 1
fi

# 4. Check edge function exists
echo "4️⃣ Checking edge function..."
if [ -f "supabase/functions/valuation/index.ts" ]; then
  echo "✅ PASS: Valuation edge function exists"
  
  # Check for AIN configuration
  if grep -q "USE_AIN_VALUATION\|AIN_UPSTREAM_URL\|AIN_API_KEY" supabase/functions/valuation/index.ts; then
    echo "✅ PASS: Edge function has AIN configuration"
  else
    echo "❌ FAIL: Edge function missing AIN configuration"
    exit 1
  fi
else
  echo "❌ FAIL: Valuation edge function not found"
  exit 1
fi

# 5. Check ESLint rules
echo "5️⃣ Checking ESLint rules..."
if [ -f ".eslintrc.json" ]; then
  if grep -q "no-restricted-imports" .eslintrc.json && grep -q "valuationEngine" .eslintrc.json; then
    echo "✅ PASS: ESLint rules block old engine imports"
  else
    echo "⚠️  WARN: ESLint rules may not block old engine imports"
  fi
else
  echo "⚠️  WARN: No ESLint config found"
fi

# 6. Check startup validation
echo "6️⃣ Checking startup validation..."
if [ -f "src/utils/startupValidation.ts" ]; then
  echo "✅ PASS: Startup validation file exists"
else
  echo "⚠️  WARN: Startup validation file not found"
fi

# 7. Try to build to catch any remaining issues
echo "7️⃣ Testing build..."
if npm run build:dev > /dev/null 2>&1; then
  echo "✅ PASS: Build completed successfully"
else
  echo "❌ FAIL: Build failed"
  echo "Running build to show errors:"
  npm run build:dev
  exit 1
fi

echo ""
echo "🎉 AIN Integration Validation Complete!"
echo ""
echo "Summary:"
echo "✅ No fallback code remaining"
echo "✅ Correct import paths enforced"
echo "✅ AIN client properly configured"
echo "✅ Edge function exists with AIN support"
echo "✅ Build passes without errors"
echo ""
echo "Expected runtime behavior:"
echo "📤 POST /functions/v1/valuation with correlation ID"
echo "📥 Response headers: x-ain-route, x-correlation-id, x-upstream-status"
echo "📊 Console logs: 'ain.ok', 'ain.route', AIN API completion messages"
echo "🚫 NO 'ain.fallback.used' or 'Using fallback valuation' messages"