#!/bin/bash

# Validation script for banned patterns
# Usage: ./scripts/validate-no-banned-patterns.sh

set -e

echo "🔍 Checking for banned patterns..."

# Check for VITE_ usage
VITE_USAGE=$(grep -r "import\.meta\.env\.VITE_" src/ || true)
if [ ! -z "$VITE_USAGE" ]; then
  echo "❌ Found import.meta.env.VITE_ usage:"
  echo "$VITE_USAGE"
  exit 1
fi

# Check for localhost URLs
LOCALHOST_USAGE=$(grep -r "localhost:" src/ || true)
if [ ! -z "$LOCALHOST_USAGE" ]; then
  echo "❌ Found hardcoded localhost URLs:"
  echo "$LOCALHOST_USAGE"
  exit 1
fi

# Check for console.log (excluding comments and allowed methods)
CONSOLE_LOG_USAGE=$(grep -r "console\.log(" src/ || true)
if [ ! -z "$CONSOLE_LOG_USAGE" ]; then
  echo "❌ Found console.log statements:"
  echo "$CONSOLE_LOG_USAGE"
  exit 1
fi

# Check for debugger statements
DEBUGGER_USAGE=$(grep -r "debugger;" src/ || true)
if [ ! -z "$DEBUGGER_USAGE" ]; then
  echo "❌ Found debugger statements:"
  echo "$DEBUGGER_USAGE"
  exit 1
fi

echo "✅ No banned patterns found!"
echo "✅ VITE_* usage: CLEAN"
echo "✅ Localhost URLs: CLEAN" 
echo "✅ Console.log statements: CLEAN"
echo "✅ Debugger statements: CLEAN"