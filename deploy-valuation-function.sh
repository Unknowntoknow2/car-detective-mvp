#!/bin/bash

# Deploy the AIN valuation function
echo "🚀 Deploying AIN valuation function..."

# Check if function exists
if [ ! -f "supabase/functions/valuation/index.ts" ]; then
    echo "❌ Function file not found: supabase/functions/valuation/index.ts"
    exit 1
fi

# Deploy function
echo "📦 Deploying to Supabase..."
supabase functions deploy valuation --project-ref xltxqqzattxogxtqrggt

# Test the deployment
echo "🧪 Testing deployed function..."
curl -i "https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/valuation" \
  -H "content-type: application/json" \
  -H "x-correlation-id: deployment-test" \
  -d '{"vin":"1HGCM82633A123456","mileage":12000,"condition":"good"}'

echo "✅ Deployment complete!"
echo "🔗 Function URL: https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/valuation"