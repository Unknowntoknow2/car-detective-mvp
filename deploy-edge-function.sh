#!/bin/bash

# Deploy the openai-web-search edge function
echo "🚀 Deploying openai-web-search edge function..."

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first."
    exit 1
fi

# Deploy the function
supabase functions deploy openai-web-search --project-ref xltxqqzattxogxtqrggt

echo "✅ Deployment complete!"
echo "🔗 Function URL: https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/openai-web-search"