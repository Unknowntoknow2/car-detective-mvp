#!/bin/bash

# Comprehensive PR Verification Script
# Tests all PRs B, C, D, E, F implementation status

set -e

echo "🔍 COMPREHENSIVE PR VERIFICATION"
echo "================================="
echo "Testing all PRs B, C, D, E, F for 100% completion"

BASE="http://127.0.0.1:54321"
TEST_VIN="5YFB4MDE8SP33B447"
DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test result tracking
declare -A test_results

# Function to test API endpoint
test_api() {
    local pr_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_key="$5"  # Key to check in response for success
    
    echo ""
    echo "🧪 Testing: $pr_name"
    echo "   Endpoint: $method $endpoint"
    
    if [[ "$method" == "POST" ]]; then
        response=$(timeout 30 curl -s -w "\n%{http_code}" \
            -X POST "$endpoint" \
            -H 'Content-Type: application/json' \
            -d "$data" 2>/dev/null || echo -e "\nERROR")
    else
        response=$(timeout 30 curl -s -w "\n%{http_code}" \
            "$endpoint" 2>/dev/null || echo -e "\nERROR")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    if [[ "$http_code" == "200" ]]; then
        # Check if expected key exists in response
        if [[ -n "$expected_key" ]]; then
            if echo "$response_body" | jq -e ".$expected_key" >/dev/null 2>&1; then
                echo -e "   ${GREEN}✅ Status: HTTP $http_code - Success (contains $expected_key)${NC}"
                test_results["$pr_name"]="✅ PASS"
                return 0
            else
                echo -e "   ${YELLOW}⚠️  Status: HTTP $http_code - Missing expected key: $expected_key${NC}"
                test_results["$pr_name"]="⚠️ PARTIAL"
                return 1
            fi
        else
            echo -e "   ${GREEN}✅ Status: HTTP $http_code - Success${NC}"
            test_results["$pr_name"]="✅ PASS"
            return 0
        fi
    elif [[ "$http_code" == "ERROR" ]]; then
        echo -e "   ${RED}❌ Status: Connection failed${NC}"
        test_results["$pr_name"]="❌ FAIL (Connection)"
        return 1
    else
        echo -e "   ${RED}❌ Status: HTTP $http_code - Failed${NC}"
        test_results["$pr_name"]="❌ FAIL (HTTP $http_code)"
        return 1
    fi
}

# Function to test database view/table
test_db() {
    local pr_name="$1"
    local query="$2"
    local description="$3"
    
    echo ""
    echo "🗄️  Testing: $pr_name"
    echo "   Query: $description"
    
    result=$(psql "$DB_URL" -t -c "$query" 2>/dev/null || echo "ERROR")
    
    if [[ "$result" == "ERROR" ]]; then
        echo -e "   ${RED}❌ Database query failed${NC}"
        test_results["$pr_name"]="❌ FAIL (DB Error)"
        return 1
    elif [[ "$result" -gt 0 ]] 2>/dev/null; then
        echo -e "   ${GREEN}✅ Success: Found $result records${NC}"
        test_results["$pr_name"]="✅ PASS"
        return 0
    else
        echo -e "   ${RED}❌ No data found${NC}"
        test_results["$pr_name"]="❌ FAIL (No Data)"
        return 1
    fi
}

echo ""
echo "🚀 STARTING COMPREHENSIVE TESTS"

# PR B - Decode VIN Base (vPIC Safety Mapping)
test_api \
    "PR B - Decode VIN" \
    "POST" \
    "$BASE/functions/v1/decode-vin" \
    "{\"vin\":\"$TEST_VIN\"}" \
    "success"

# PR C - Recalls
test_api \
    "PR C - Recalls" \
    "POST" \
    "$BASE/functions/v1/recalls" \
    "{\"vin\":\"$TEST_VIN\"}" \
    "vin"

# PR D - Safety Ratings (NCAP)
test_api \
    "PR D - Safety Ratings" \
    "POST" \
    "$BASE/functions/v1/safety" \
    "{\"vin\":\"$TEST_VIN\"}" \
    "vin"

# PR E - Profile (Unified View) - Test as database view since there's no edge function
test_db \
    "PR E - Profile View" \
    "SELECT COUNT(*) FROM vehicle_profiles WHERE vin = '$TEST_VIN';" \
    "vehicle_profiles view access"

# PR F - Backfill Job
test_api \
    "PR F - Backfill Job" \
    "POST" \
    "$BASE/functions/v1/jobs/backfill-safety-json" \
    "{\"days\":1,\"limit\":1,\"dry_run\":true,\"rate_limit_ms\":100}" \
    "success"

echo ""
echo "🗄️  ADDITIONAL DATABASE VALIDATION"

# Test core tables exist and have data
tables=("vehicle_specs" "vin_history" "nhtsa_recalls" "nhtsa_safety_ratings" "vehicle_profiles")

for table in "${tables[@]}"; do
    echo ""
    echo "📊 Checking table: $table"
    count=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null || echo "0")
    if [[ "$count" -gt 0 ]] 2>/dev/null; then
        echo -e "   ${GREEN}✅ Table exists with $count records${NC}"
    else
        echo -e "   ${RED}❌ Table missing or empty${NC}"
    fi
done

echo ""
echo "🔧 CHECKING IMPLEMENTATION FILES"

# Check if all edge functions exist
functions=("decode-vin" "recalls" "safety" "jobs/backfill-safety-json")
for func in "${functions[@]}"; do
    if [[ -f "/workspaces/ain-valuation-engine/supabase/functions/$func/index.ts" ]]; then
        echo -e "${GREEN}✅ Function file exists: $func/index.ts${NC}"
    else
        echo -e "${RED}❌ Function file missing: $func/index.ts${NC}"
    fi
done

# Check GitHub Action
if [[ -f "/workspaces/ain-valuation-engine/.github/workflows/backfill-safety-json.yml" ]]; then
    echo -e "${GREEN}✅ GitHub Action exists: backfill-safety-json.yml${NC}"
else
    echo -e "${RED}❌ GitHub Action missing: backfill-safety-json.yml${NC}"
fi

echo ""
echo "📋 FINAL RESULTS SUMMARY"
echo "========================"

total_tests=0
passed_tests=0

for pr in "${!test_results[@]}"; do
    result="${test_results[$pr]}"
    echo "   $pr: $result"
    total_tests=$((total_tests + 1))
    if [[ "$result" == *"✅ PASS"* ]]; then
        passed_tests=$((passed_tests + 1))
    fi
done

echo ""
echo "🎯 COMPLETION STATUS:"
echo "   Passed: $passed_tests/$total_tests tests"

if [[ $passed_tests -eq $total_tests ]]; then
    echo -e "${GREEN}🎉 ALL PRs 100% COMPLETE AND WORKING!${NC}"
    exit 0
elif [[ $passed_tests -gt 0 ]]; then
    echo -e "${YELLOW}⚠️  PARTIAL COMPLETION - Some PRs need deployment or fixes${NC}"
    exit 1
else
    echo -e "${RED}❌ MAJOR ISSUES - Most PRs not working${NC}"
    exit 2
fi
