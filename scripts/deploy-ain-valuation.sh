#!/bin/bash

# Deploy AIN valuation edge function with proper configuration
echo "🚀 Deploying AIN valuation edge function..."

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first."
    exit 1
fi

# Deploy the valuation function
echo "📦 Deploying valuation function..."
supabase functions deploy valuation --project-ref xltxqqzattxogxtqrggt

# Verify deployment
echo "🔍 Verifying deployment..."
supabase functions list --project-ref xltxqqzattxogxtqrggt | grep valuation

echo "✅ Deployment complete!"
echo "🔗 Function URL: https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/valuation"

echo ""
echo "⚠️  Required secrets (set these in Supabase dashboard):"
echo "   - AIN_API_KEY: Your AIN API key"
echo "   - AIN_UPSTREAM_URL: https://api.ain.ai/v1"
echo "   - USE_AIN_VALUATION: true"
echo "   - ENVIRONMENT: production"

echo ""
echo "🧪 Test the function:"
echo 'curl -i "https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/valuation" \'
echo '  -H "content-type: application/json" -H "x-correlation-id: test" \'
echo '  -d '"'"'{"vin":"1HGCM82633A123456","mileage":12000,"condition":"good"}'"'"