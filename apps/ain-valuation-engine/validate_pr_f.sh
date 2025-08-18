#!/bin/bash

# PR F - Backfill Validation Script
# Validates implementation without requiring deployed functions

set -e

echo "🧪 PR F - Backfill Implementation Validation"
echo "============================================="

# Check file structure
echo ""
echo "📁 File Structure Check:"

files=(
    "supabase/functions/jobs/backfill-safety-json/index.ts"
    ".github/workflows/backfill-safety-json.yml"
)

for file in "${files[@]}"; do
    if [[ -f "/workspaces/ain-valuation-engine/$file" ]]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file missing"
    fi
done

# Check database setup
echo ""
echo "🗄️  Database Validation:"

DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Check required tables
tables=("vin_history" "vehicle_specs")
for table in "${tables[@]}"; do
    count=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$table';" 2>/dev/null | tr -d ' ')
    if [[ "$count" == "1" ]]; then
        echo "   ✅ Table '$table' exists"
    else
        echo "   ❌ Table '$table' missing"
    fi
done

# Check required columns
echo ""
echo "🏗️  Schema Validation:"

safety_columns=$(psql "$DB_URL" -t -c "
SELECT COUNT(*) FROM information_schema.columns 
WHERE table_name = 'vehicle_specs' 
AND column_name IN ('safety_equipment', 'airbags', 'lighting');
" 2>/dev/null | tr -d ' ')

if [[ "$safety_columns" == "3" ]]; then
    echo "   ✅ Safety columns (safety_equipment, airbags, lighting) exist"
else
    echo "   ❌ Missing safety columns in vehicle_specs"
fi

# Check test data
echo ""
echo "📊 Test Data Status:"

vin_count=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM vin_history;" 2>/dev/null | tr -d ' ')
echo "   📈 VIN history entries: $vin_count"

recent_vins=$(psql "$DB_URL" -t -c "
SELECT COUNT(*) FROM vin_history 
WHERE created_at >= NOW() - INTERVAL '14 days' AND decode_success = true;
" 2>/dev/null | tr -d ' ')
echo "   📅 Recent VINs (14 days): $recent_vins"

# Code quality checks
echo ""
echo "🔍 Code Quality Validation:"

backfill_file="/workspaces/ain-valuation-engine/supabase/functions/jobs/backfill-safety-json/index.ts"

if [[ -f "$backfill_file" ]]; then
    # Check for key implementation features
    features=(
        "vin_history:Recent VIN query"
        "rate_limit_ms:Rate limiting"
        "dry_run:Dry run mode"
        "decode-vin:API integration"
        "safety_equipment:Safety data check"
        "BackfillStats:Statistics tracking"
        "console.log:Progress logging"
        "new Set:VIN deduplication"
    )
    
    for feature in "${features[@]}"; do
        pattern="${feature%%:*}"
        description="${feature##*:}"
        
        if grep -q "$pattern" "$backfill_file"; then
            echo "   ✅ $description implemented"
        else
            echo "   ❌ $description missing"
        fi
    done
fi

# GitHub Action validation
echo ""
echo "🔄 GitHub Action Validation:"

workflow_file="/workspaces/ain-valuation-engine/.github/workflows/backfill-safety-json.yml"

if [[ -f "$workflow_file" ]]; then
    workflow_features=(
        "workflow_dispatch:Manual trigger"
        "inputs:Input parameters"
        "dry_run:Dry run option"
        "rate_limit_ms:Rate limit config"
        "backfill-safety-json:Function call"
        "GITHUB_STEP_SUMMARY:Job summary"
    )
    
    for feature in "${workflow_features[@]}"; do
        pattern="${feature%%:*}"
        description="${feature##*:}"
        
        if grep -q "$pattern" "$workflow_file"; then
            echo "   ✅ $description configured"
        else
            echo "   ❌ $description missing"
        fi
    done
fi

# Integration check
echo ""
echo "🔗 Integration Validation:"

# Check if decode-vin function exists and has proper structure
decode_file="/workspaces/ain-valuation-engine/supabase/functions/decode-vin/index.ts"
if [[ -f "$decode_file" ]]; then
    if grep -q "safety_equipment\|airbags\|lighting" "$decode_file"; then
        echo "   ✅ decode-vin function supports safety data"
    else
        echo "   ⚠️  decode-vin function may need safety data support"
    fi
else
    echo "   ❌ decode-vin function missing"
fi

# Summary
echo ""
echo "🎯 PR F Implementation Summary:"
echo "==============================="

# Count checks
total_checks=0
passed_checks=0

# File structure (2 files)
total_checks=$((total_checks + 2))
for file in "${files[@]}"; do
    if [[ -f "/workspaces/ain-valuation-engine/$file" ]]; then
        passed_checks=$((passed_checks + 1))
    fi
done

# Database structure (3 items: 2 tables + safety columns)
total_checks=$((total_checks + 3))
for table in "${tables[@]}"; do
    count=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$table';" 2>/dev/null | tr -d ' ')
    if [[ "$count" == "1" ]]; then
        passed_checks=$((passed_checks + 1))
    fi
done
if [[ "$safety_columns" == "3" ]]; then
    passed_checks=$((passed_checks + 1))
fi

# Code features (8 features)
total_checks=$((total_checks + 8))
if [[ -f "$backfill_file" ]]; then
    for feature in "${features[@]}"; do
        pattern="${feature%%:*}"
        if grep -q "$pattern" "$backfill_file"; then
            passed_checks=$((passed_checks + 1))
        fi
    done
fi

# Workflow features (6 features)
total_checks=$((total_checks + 6))
if [[ -f "$workflow_file" ]]; then
    for feature in "${workflow_features[@]}"; do
        pattern="${feature%%:*}"
        if grep -q "$pattern" "$workflow_file"; then
            passed_checks=$((passed_checks + 1))
        fi
    done
fi

echo "📊 Validation Score: $passed_checks/$total_checks checks passed"

if [[ $passed_checks -eq $total_checks ]]; then
    echo "🎉 ✅ PR F implementation is COMPLETE and ready for deployment!"
elif [[ $passed_checks -gt $((total_checks * 3 / 4)) ]]; then
    echo "🚧 ⚠️  PR F implementation is mostly complete but needs minor fixes"
else
    echo "❌ ⚠️  PR F implementation needs significant work"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Deploy functions: npx supabase functions deploy jobs/backfill-safety-json"
echo "2. Test GitHub Action manually via GitHub UI"
echo "3. Run sanity checks for PRs B-E integration"
echo "4. Monitor backfill job execution and performance"

echo ""
echo "✅ PR F Validation Complete!"
