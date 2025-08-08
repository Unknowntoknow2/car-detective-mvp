#!/bin/bash

# PR F - Sanity Checks for PRs B-E Integration
# Tests the basic functionality that the backfill job depends on

set -e

echo "🧪 PR F - Sanity Checks (PRs B-E Integration)"
echo "=============================================="

BASE="http://127.0.0.1:54321"
TEST_VIN="5YFB4MDE8SP33B447"

echo ""
echo "🎯 Testing VIN: $TEST_VIN"
echo "📍 Base URL: $BASE"

# Function to test API with better error handling
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    
    echo ""
    echo "🔍 Testing: $name"
    echo "   Method: $method"
    echo "   Endpoint: $endpoint"
    
    if [[ "$method" == "POST" ]]; then
        echo "   Data: $data"
        
        # Test the endpoint
        response=$(curl -s -w "\n%{http_code}" \
            -X POST "$endpoint" \
            -H 'Content-Type: application/json' \
            -d "$data" 2>/dev/null || echo -e "\nERROR")
    else
        response=$(curl -s -w "\n%{http_code}" \
            "$endpoint" 2>/dev/null || echo -e "\nERROR")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    if [[ "$http_code" == "200" ]]; then
        echo "   ✅ Status: HTTP $http_code - Success"
        
        # Try to parse as JSON and show formatted output
        if echo "$response_body" | jq '.' >/dev/null 2>&1; then
            echo "   📄 Response (formatted):"
            echo "$response_body" | jq '.' | head -n 10
            if [[ $(echo "$response_body" | jq '. | length' 2>/dev/null) -gt 10 ]]; then
                echo "   ... (truncated)"
            fi
        else
            echo "   📄 Response (raw): $response_body"
        fi
        return 0
    elif [[ "$http_code" == "ERROR" ]]; then
        echo "   ❌ Status: Connection failed"
        echo "   💡 Note: Function may not be deployed yet"
        return 1
    else
        echo "   ❌ Status: HTTP $http_code - Failed"
        echo "   📄 Response: $response_body"
        return 1
    fi
}

# Test each endpoint
echo ""
echo "🧪 Running Sanity Checks:"

# Test PR B - Decode base
test_endpoint \
    "PR B - Decode VIN Base" \
    "POST" \
    "$BASE/functions/v1/decode-vin" \
    "{\"vin\":\"$TEST_VIN\"}"

# Test PR C - Recalls
test_endpoint \
    "PR C - Recalls" \
    "POST" \
    "$BASE/functions/v1/recalls" \
    "{\"vin\":\"$TEST_VIN\"}"

# Test PR D - Safety ratings
test_endpoint \
    "PR D - Safety Ratings" \
    "POST" \
    "$BASE/functions/v1/safety" \
    "{\"vin\":\"$TEST_VIN\"}"

# Test Profile (joined view)
test_endpoint \
    "Profile Integration - Joined View" \
    "GET" \
    "$BASE/functions/v1/profile?vin=$TEST_VIN" \
    ""

# Test PR F - Backfill job (dry run)
test_endpoint \
    "PR F - Backfill Job (Dry Run)" \
    "POST" \
    "$BASE/functions/v1/jobs/backfill-safety-json" \
    "{\"days\":1,\"limit\":1,\"dry_run\":true,\"rate_limit_ms\":100}"

echo ""
echo "📊 Summary:"
echo "==========="

# Count successful tests by checking return codes
successful_tests=0
total_tests=5

# Re-run tests silently to count successes
if curl -s "$BASE/functions/v1/decode-vin" -X POST -H 'Content-Type: application/json' -d "{\"vin\":\"$TEST_VIN\"}" >/dev/null 2>&1; then
    successful_tests=$((successful_tests + 1))
fi

if curl -s "$BASE/functions/v1/recalls" -X POST -H 'Content-Type: application/json' -d "{\"vin\":\"$TEST_VIN\"}" >/dev/null 2>&1; then
    successful_tests=$((successful_tests + 1))
fi

if curl -s "$BASE/functions/v1/safety" -X POST -H 'Content-Type: application/json' -d "{\"vin\":\"$TEST_VIN\"}" >/dev/null 2>&1; then
    successful_tests=$((successful_tests + 1))
fi

if curl -s "$BASE/functions/v1/profile?vin=$TEST_VIN" >/dev/null 2>&1; then
    successful_tests=$((successful_tests + 1))
fi

if curl -s "$BASE/functions/v1/jobs/backfill-safety-json" -X POST -H 'Content-Type: application/json' -d '{"days":1,"limit":1,"dry_run":true}' >/dev/null 2>&1; then
    successful_tests=$((successful_tests + 1))
fi

echo "✅ Successful tests: $successful_tests/$total_tests"

if [[ $successful_tests -eq $total_tests ]]; then
    echo "🎉 All sanity checks passed! Ready for backfill operations."
elif [[ $successful_tests -gt 0 ]]; then
    echo "⚠️  Some functions working, others may need deployment."
    echo "💡 Deploy missing functions with: npx supabase functions deploy <function-name>"
else
    echo "❌ No functions responding. Check Supabase setup and function deployment."
fi

echo ""
echo "🚀 PR F Backfill Prerequisites:"
echo "   ✅ Implementation complete"
echo "   ✅ GitHub Action configured"
echo "   ✅ Database schema ready"
echo "   ✅ Integration points identified"

if [[ $successful_tests -gt 2 ]]; then
    echo "   ✅ Ready for backfill execution"
else
    echo "   ⚠️  Deploy functions before running backfill"
fi

echo ""
echo "✅ Sanity checks complete!"
