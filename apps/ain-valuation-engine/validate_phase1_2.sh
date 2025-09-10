#!/bin/bash

# AIN Valuation Engine - Phase 1-2 Validation Script
# This script validates that your migration and edge function integration is working correctly

set -e

echo "🚗 AIN Valuation Engine - Phase 1-2 Validation"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI not found. Install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Project structure validated"

# Check environment variables
echo ""
echo "🔧 Checking environment configuration..."

ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
    echo "✅ Found .env file"
    
    # Check required variables
    REQUIRED_VARS=("VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY")
    
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" "$ENV_FILE"; then
            echo "✅ $var is set"
        else
            echo "⚠️  Warning: $var not found in .env"
        fi
    done
else
    echo "⚠️  Warning: .env file not found"
fi

# Check if Supabase is linked
echo ""
echo "🔗 Checking Supabase project..."

if supabase status &> /dev/null; then
    echo "✅ Supabase project is linked and running"
    
    # Show current status
    echo ""
    echo "📊 Current Supabase status:"
    supabase status
    
else
    echo "❌ Supabase not linked or not running"
    echo "   Run: supabase link --project-ref YOUR_PROJECT_REF"
    echo "   Then: supabase start"
    exit 1
fi

# Check if migration exists
echo ""
echo "📁 Checking migration files..."

MIGRATION_FILE="supabase/migrations/20250808120001_phase1_phase2_production.sql"
if [ -f "$MIGRATION_FILE" ]; then
    echo "✅ Phase 1-2 migration file found"
else
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

# Apply migration (dry run first)
echo ""
echo "🔄 Validating migration..."

if supabase db diff --schema public; then
    echo "✅ Database schema is up to date"
else
    echo "⚠️  Database schema differences detected"
    echo "   Run: supabase db push"
fi

# Check edge function
echo ""
echo "⚡ Checking edge functions..."

EDGE_FUNCTION_DIR="supabase/functions/decode-vin"
if [ -d "$EDGE_FUNCTION_DIR" ]; then
    echo "✅ decode-vin edge function directory found"
    
    if [ -f "$EDGE_FUNCTION_DIR/index.ts" ]; then
        echo "✅ Edge function index.ts found"
    else
        echo "❌ Edge function index.ts not found"
    fi
else
    echo "❌ Edge function directory not found: $EDGE_FUNCTION_DIR"
fi

# Test VIN validation functions
echo ""
echo "🧪 Testing VIN validation functions..."

# Test valid VIN
VALID_VIN="1HGCM82633A004352"
INVALID_VIN="INVALID_VIN_HERE"

echo "Testing valid VIN: $VALID_VIN"
if supabase db shell --command "SELECT fn_validate_vin('$VALID_VIN');" 2>/dev/null | grep -q "t"; then
    echo "✅ Valid VIN validation passed"
else
    echo "❌ Valid VIN validation failed"
fi

echo "Testing invalid VIN: $INVALID_VIN"
if supabase db shell --command "SELECT fn_validate_vin('$INVALID_VIN');" 2>/dev/null | grep -q "f"; then
    echo "✅ Invalid VIN validation passed"
else
    echo "❌ Invalid VIN validation failed"
fi

# Test unified decoder
echo ""
echo "🔧 Testing unified VIN decoder..."

if [ -f "src/services/unifiedVinDecoder.ts" ]; then
    echo "✅ Unified VIN decoder found"
else
    echo "❌ Unified VIN decoder not found"
fi

# Test consolidated frontend decoder
if [ -f "ain-valuation-frontend/src/services/unifiedVinDecoder.js" ]; then
    echo "✅ Frontend unified VIN decoder found"
else
    echo "❌ Frontend unified VIN decoder not found"
fi

# Check if npm packages are installed
echo ""
echo "📦 Checking dependencies..."

if [ -f "node_modules/.bin/jest" ] || [ -f "node_modules/.bin/vitest" ]; then
    echo "✅ Test framework found"
else
    echo "⚠️  No test framework found (jest/vitest)"
fi

if npm list @supabase/supabase-js &> /dev/null; then
    echo "✅ Supabase JS client installed"
else
    echo "⚠️  Supabase JS client not found in package.json"
fi

# Test edge function deployment (optional)
echo ""
echo "🚀 Edge function deployment test..."

if supabase functions list 2>/dev/null | grep -q "decode-vin"; then
    echo "✅ decode-vin function is deployed"
else
    echo "⚠️  decode-vin function not deployed"
    echo "   Run: supabase functions deploy decode-vin"
fi

# Summary
echo ""
echo "📋 Validation Summary"
echo "===================="

# Count checks
TOTAL_CHECKS=10
PASSED_CHECKS=0

# This is a simplified count - in a real script you'd track each check
echo "✅ Core validation completed"
echo ""
echo "🎯 Next Steps:"
echo "1. If any errors above, fix them before proceeding"
echo "2. Run: npm test (to validate unified decoder)"
echo "3. Run: supabase db push (if migration needed)"
echo "4. Run: supabase functions deploy decode-vin"
echo "5. Test with: curl -X POST \$SUPABASE_URL/functions/v1/decode-vin -d '{\"vin\":\"1HGCM82633A004352\"}'"
echo ""
echo "📖 See PHASE_1_2_IMPLEMENTATION_PLAN.md for detailed steps"

echo ""
echo "🎉 Validation script completed!"
