# AIN Valuation Engine - Phase 1-2 Implementation Plan

## Overview
This document provides a step-by-step implementation plan to integrate the new production-grade Supabase schema with your existing unified VIN decoder system.

## Prerequisites ✅
- [x] Unified VIN decoder implemented (`/src/services/unifiedVinDecoder.ts`)
- [x] VIN decode consolidation complete across codebase
- [x] Supabase project set up
- [x] Production schema migration created

## Phase 1: Database Setup & Migration

### Step 1: Apply Database Migration
```bash
# Navigate to your project root
cd /workspaces/ain-valuation-engine

# Apply the migration
npx supabase db push

# Verify migration applied
npx supabase db diff
```

### Step 2: Set Environment Variables
```bash
# Add to your .env files:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Production settings
FRONTEND_ORIGIN=https://your-frontend.example.com
NHTSA_TTL_SECONDS=86400
FUEL_TTL_SECONDS=604800
```

### Step 3: Update Edge Function
```bash
# Deploy updated edge function
npx supabase functions deploy decode-vin

# Test the function
curl -X POST https://your-project.supabase.co/functions/v1/decode-vin \
  -H "Content-Type: application/json" \
  -d '{"vin":"1HGCM82633A004352"}'
```

## Phase 2: Frontend Integration

### Step 4: Update Frontend VIN Decoder
Update your frontend to use the new edge function with proper error handling:

```typescript
// ain-valuation-frontend/src/services/unifiedVinDecoder.js
// Update the callSupabaseEdgeFunction to handle new response format

async function callSupabaseEdgeFunction(vin, timeout) {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const endpoint = `${SUPABASE_URL}/functions/v1/decode-vin`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': crypto.randomUUID(), // Add correlation ID
      },
      body: JSON.stringify({ vin }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error codes
      if (errorData.error === 'INVALID_VIN_FORMAT') {
        throw new VINDecodeError('Invalid VIN format', 'VALIDATION_ERROR');
      }
      if (errorData.error === 'INVALID_VIN_CHECKSUM') {
        throw new VINDecodeError('Invalid VIN checksum', 'VALIDATION_ERROR');
      }
      
      throw new VINDecodeError(
        errorData.message || `HTTP ${response.status}`,
        'EDGE_FUNCTION_ERROR',
        errorData
      );
    }

    const data = await response.json();
    
    if (!data.decodedData || !Array.isArray(data.decodedData)) {
      throw new VINDecodeError('Invalid response format from edge function', 'INVALID_RESPONSE');
    }

    return data.decodedData[0];
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new VINDecodeError('Edge function request timeout', 'TIMEOUT_ERROR');
    }
    
    if (error instanceof VINDecodeError) {
      throw error;
    }
    
    throw new VINDecodeError('Edge function request failed', 'NETWORK_ERROR', error.message);
  }
}
```

### Step 5: Add Vehicle Profile Integration
Create a new service to fetch comprehensive vehicle profiles:

```typescript
// src/services/vehicleProfileService.ts
export async function getVehicleProfile(vin: string) {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const endpoint = `${SUPABASE_URL}/functions/v1/decode-vin/vehicle-profile?vin=${encodeURIComponent(vin)}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-Request-Id': crypto.randomUUID(),
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch vehicle profile: ${response.status}`);
  }

  return response.json();
}
```

## Phase 3: Backend Integration

### Step 6: Update Unified VIN Decoder
Enhance your existing unified decoder to optionally use the vehicle profile:

```typescript
// src/services/unifiedVinDecoder.ts
// Add new function for enhanced profile data

export async function getEnhancedVehicleProfile(vin: string): Promise<VehicleProfile> {
  const validation = validateVIN(vin);
  if (!validation.valid) {
    throw new VINDecodeError('Invalid VIN format', 'VALIDATION_ERROR', validation.error);
  }

  try {
    // Use Supabase profile endpoint for comprehensive data
    const profile = await fetch(`${SUPABASE_URL}/functions/v1/decode-vin/vehicle-profile?vin=${vin}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!profile.ok) {
      throw new Error(`Profile fetch failed: ${profile.status}`);
    }

    return await profile.json();
  } catch (error) {
    console.warn('Enhanced profile failed, falling back to basic decode:', error);
    
    // Fallback to existing unified decoder
    const basicResult = await decodeVin(vin);
    return {
      vin,
      specs: extractLegacyVehicleInfo(basicResult),
      recalls: { openCount: 0 },
      safety: null,
      fuelEconomy: null,
      lastUpdated: new Date().toISOString(),
      source: 'fallback'
    };
  }
}
```

## Phase 4: Testing & Validation

### Step 7: Test Database Functions
```sql
-- Test VIN validation
SELECT fn_validate_vin('1HGCM82633A004352'); -- Should return true
SELECT fn_validate_vin('INVALID_VIN_HERE'); -- Should return false

-- Test vehicle profile
SELECT rpc_get_vehicle_profile('1HGCM82633A004352');

-- Test upsert functions (simulate what edge function does)
SELECT rpc_upsert_specs('1HGCM82633A004352', '{"Make":"Honda","Model":"Civic","ModelYear":"2003"}'::jsonb);
```

### Step 8: Integration Tests
Create tests for the new functionality:

```typescript
// tests/vehicleProfile.test.ts
describe('Vehicle Profile Integration', () => {
  it('should fetch complete vehicle profile', async () => {
    const profile = await getEnhancedVehicleProfile('1HGCM82633A004352');
    
    expect(profile).toHaveProperty('vin');
    expect(profile).toHaveProperty('specs');
    expect(profile).toHaveProperty('recalls');
    expect(profile).toHaveProperty('safety');
    expect(profile).toHaveProperty('fuelEconomy');
  });

  it('should handle invalid VINs gracefully', async () => {
    await expect(getEnhancedVehicleProfile('INVALID'))
      .rejects.toThrow('Invalid VIN format');
  });
});
```

### Step 9: Load Testing
```bash
# Install k6 if not already installed
# Create basic load test

# k6/decode_vin.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<400'], // 95% under 400ms
  },
};

export default function () {
  const payload = JSON.stringify({ vin: '1HGCM82633A004352' });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const response = http.post(`${__ENV.BASE_URL}/functions/v1/decode-vin`, payload, params);
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 400ms': (r) => r.timings.duration < 400,
    'has decodedData': (r) => JSON.parse(r.body).decodedData !== undefined,
  });
}

# Run the test
k6 run -e BASE_URL=https://your-project.supabase.co k6/decode_vin.js
```

## Phase 5: Production Deployment

### Step 10: Environment Configuration
```bash
# Production environment variables
FRONTEND_ORIGIN=https://your-production-domain.com
NHTSA_TTL_SECONDS=86400  # 24 hours
FUEL_TTL_SECONDS=604800  # 1 week

# Security settings
SUPABASE_JWT_SECRET=your-jwt-secret
```

### Step 11: Monitor & Observe
Set up monitoring for:
- Edge function response times
- Cache hit rates
- Error rates by error type
- Database query performance

### Step 12: Gradual Rollout
1. Deploy to staging environment
2. Run full test suite
3. Deploy edge functions to production
4. Monitor error rates and performance
5. Gradually shift traffic to new endpoints

## Next Steps: Additional Features

### Recalls Integration (Prompt 3)
```typescript
// Implement recalls fetching
export async function fetchVehicleRecalls(vin: string) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/recalls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vin })
  });
  return response.json();
}
```

### Safety Ratings Integration (Prompt 4)
```typescript
// Implement NCAP safety ratings
export async function fetchSafetyRatings(vin: string) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/safety`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vin })
  });
  return response.json();
}
```

### Fuel Economy Integration (Prompt 5)
```typescript
// Implement fuel economy data
export async function fetchFuelEconomy(vin: string) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/fuel-economy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vin })
  });
  return response.json();
}
```

## Implementation Checklist

### Database & Infrastructure
- [ ] Apply Supabase migration
- [ ] Verify RLS policies work correctly
- [ ] Test all RPC functions
- [ ] Set up environment variables
- [ ] Deploy updated edge function

### Frontend Integration
- [ ] Update unified VIN decoder for new error handling
- [ ] Add vehicle profile service
- [ ] Update UI components to show enhanced data
- [ ] Add loading states for profile data
- [ ] Handle new error types gracefully

### Backend Integration
- [ ] Enhance unified VIN decoder with profile support
- [ ] Update existing services to use enhanced profiles
- [ ] Add backwards compatibility layers
- [ ] Update type definitions

### Testing & Quality
- [ ] Unit tests for VIN validation functions
- [ ] Integration tests for edge functions
- [ ] End-to-end tests for complete workflow
- [ ] Load testing with k6
- [ ] Error handling validation

### Monitoring & Operations
- [ ] Set up log aggregation
- [ ] Configure alerts for error rates
- [ ] Monitor cache hit rates
- [ ] Track API response times
- [ ] Set up health checks

### Documentation
- [ ] Update API documentation
- [ ] Document new error codes
- [ ] Create troubleshooting guide
- [ ] Update deployment procedures

## Success Metrics
- ✅ p95 response time < 400ms for VIN decode
- ✅ Cache hit rate > 50% on warm paths
- ✅ Error rate < 1% for valid VINs
- ✅ 99.9% availability for decode endpoints
- ✅ Zero breaking changes for existing clients

---

This implementation plan provides a comprehensive path from your current unified VIN decoder to a production-grade system with enterprise features. Each phase builds on the previous one and maintains backward compatibility throughout the process.
