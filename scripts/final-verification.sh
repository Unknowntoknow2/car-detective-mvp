#!/bin/bash

echo "🔍 Final Production Readiness Verification"
echo "=========================================="

# 1) No VITE usage
echo "1. Checking for VITE usage..."
if git grep -n "import\.meta\.env\.VITE_" -- "src"; then
  echo "❌ FOUND VITE usage"
  exit 1
else
  echo "✅ OK - No VITE usage"
fi

# 2) No localhost usage  
echo "2. Checking for localhost usage..."
if git grep -n "localhost:" -- "src"; then
  echo "❌ FOUND localhost usage"
  exit 1
else
  echo "✅ OK - No localhost usage"
fi

# 3) No console.log/info/debugger
echo "3. Checking for console.log usage..."
if git grep -n "console\.log(" -- "src"; then
  echo "❌ FOUND console.log usage"
  exit 1
else
  echo "✅ OK - No console.log usage"
fi

echo "4. Checking for console.info usage..."
if git grep -n "console\.info(" -- "src"; then
  echo "❌ FOUND console.info usage"  
  exit 1
else
  echo "✅ OK - No console.info usage"
fi

echo "5. Checking for debugger usage..."
if git grep -n "^\s*debugger;" -- "src"; then
  echo "❌ FOUND debugger usage"
  exit 1  
else
  echo "✅ OK - No debugger usage"
fi

# 4) Type safety
echo "6. Running TypeScript check..."
if npm run typecheck; then
  echo "✅ OK - TypeScript check passed"
else
  echo "❌ TypeScript check failed"
  exit 1
fi

# 5) Lint check
echo "7. Running ESLint..."
if npm run lint; then
  echo "✅ OK - ESLint passed"
else
  echo "❌ ESLint failed"
  exit 1
fi

echo ""
echo "🎉 ALL VERIFICATION CHECKS PASSED!"
echo "Repository is production-ready for launch."