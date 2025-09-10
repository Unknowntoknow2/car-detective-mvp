# AIN Valuation Function Deployment

## Issue Identified
The `valuation` edge function is not deployed to Supabase, causing 404 errors when the app tries to call it.

## Required Actions

### 1. Deploy the Function
Run these commands in your terminal:

```bash
# Deploy the valuation function
supabase functions deploy valuation --project-ref xltxqqzattxogxtqrggt

# Verify deployment
supabase functions list --project-ref xltxqqzattxogxtqrggt | grep valuation
```

### 2. Set Required Secrets
Go to Supabase Dashboard > Edge Functions > Secrets and set:

```
AIN_API_KEY=your_real_ain_api_key_here
AIN_UPSTREAM_URL=https://api.ain.ai/v1
USE_AIN_VALUATION=true
ENVIRONMENT=production
```

### 3. Test the Function
After deployment, test it directly:

```bash
curl -i "https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/valuation" \
  -H "content-type: application/json" \
  -H "x-correlation-id: test" \
  -d '{"vin":"1HGCM82633A123456","mileage":12000,"condition":"good"}'
```

Expected response headers:
- `x-ain-route: ain`
- `x-upstream-status: 2xx`
- `x-correlation-id: test`

### 4. Verify in App
Once deployed, the app should call `/functions/v1/valuation` successfully and display AIN route badges in dev mode.

## Status
- ✅ Function code created (`supabase/functions/valuation/index.ts`)
- ✅ CORS configuration updated
- ✅ Config.toml updated
- ❌ **Function needs deployment** (this is the missing step)
- ❌ **Secrets need to be set**