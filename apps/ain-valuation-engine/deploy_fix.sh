#!/bin/bash

echo "🚀 Supabase Edge Function Deployment Instructions"
echo "=================================================="
echo ""
echo "PROBLEM: The deployed edge function returns limited data format"
echo "SOLUTION: Redeploy with corrected code"
echo ""
echo "1️⃣ Deploy the corrected edge function:"
echo "   cd /workspaces/ain-valuation-engine"
echo "   supabase functions deploy decode-vin"
echo ""
echo "2️⃣ Test the deployment:"
echo "   curl -X POST \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -H \"Authorization: Bearer YOUR_ANON_KEY\" \\"
echo "     -d '{\"vin\":\"4T1C31AK0LU533615\"}' \\"
echo "     https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/decode-vin"
echo ""
echo "3️⃣ Expected result should contain:"
echo "   - \"Make\": \"TOYOTA\" (not \"make\")"
echo "   - \"BodyClass\": \"Sedan/Saloon\""
echo "   - \"Manufacturer\": \"TOYOTA MOTOR...\""
echo "   - All original NHTSA field names"
echo ""
echo "4️⃣ Once deployed, test frontend with VIN: 4T1C31AK0LU533615"
echo ""
echo "ALTERNATIVE: Use direct NHTSA API mode in frontend:"
echo "   In App.jsx, change: await decodeVIN(vin, { useDirectAPI: true })"
echo ""

# Test if supabase CLI is available
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI detected"
    echo "Run: supabase functions deploy decode-vin"
else
    echo "❌ Supabase CLI not found"
    echo "Install: npm install supabase --save-dev"
fi
