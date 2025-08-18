#!/bin/bash

# PR F - Simplified Backfill Test
set -e

echo "🧪 PR F - Backfill Safety JSON Test (Simplified)"
echo "================================================"

BASE_URL="http://127.0.0.1:54321"
TEST_VIN="5YFB4MDE8SP33B447"

echo ""
echo "🚀 Testing Backfill Job Function"

# Test 1: Dry run
echo ""
echo "Test 1: Dry Run Mode"
curl -s -X POST "$BASE_URL/functions/v1/jobs/backfill-safety-json" \
  -H 'Content-Type: application/json' \
  -d '{"days":1,"limit":5,"dry_run":true,"rate_limit_ms":100}' | jq '.'

# Test 2: Small backfill execution
echo ""
echo "Test 2: Small Backfill Execution"
curl -s -X POST "$BASE_URL/functions/v1/jobs/backfill-safety-json" \
  -H 'Content-Type: application/json' \
  -d '{"days":2,"limit":3,"dry_run":false,"rate_limit_ms":100}' | jq '.'

# Test 3: Check database state
echo ""
echo "Test 3: Database Verification"
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "
SELECT 
  COUNT(*) as total_vins,
  COUNT(CASE WHEN decode_success THEN 1 END) as successful_decodes
FROM vin_history 
WHERE created_at >= NOW() - INTERVAL '7 days';
"

echo ""
echo "✅ PR F Backfill Test Complete"
