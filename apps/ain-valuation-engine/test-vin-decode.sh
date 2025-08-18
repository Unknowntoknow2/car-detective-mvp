#!/bin/bash

# Test script to verify VIN decode edge function works without Authorization

echo "🧪 Testing VIN decode edge function without Authorization header..."
echo ""

# Test with local endpoint (if running supabase locally)
LOCAL_URL="http://localhost:54321/functions/v1/decode-vin"
REMOTE_URL="https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/decode-vin"

TEST_VIN="5YFB4MDE8SP33B447"

echo "📍 Testing LOCAL endpoint: $LOCAL_URL"
curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"vin\":\"$TEST_VIN\"}" \
  $LOCAL_URL 2>/dev/null | jq '.' || echo "❌ Local endpoint not available or failed"

echo ""
echo "📍 Testing REMOTE endpoint: $REMOTE_URL"
curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"vin\":\"$TEST_VIN\"}" \
  $REMOTE_URL 2>/dev/null | jq '.' || echo "❌ Remote endpoint requires authorization (needs deployment)"

echo ""
echo "✅ Edge function code updated - deploy with 'supabase functions deploy decode-vin' to apply changes"
