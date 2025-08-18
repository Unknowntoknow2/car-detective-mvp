/**
 * Migration Guide & Helper Functions
 * Assists in migrating from fragmented VIN decoders to unified service
 */

import { decodeVin, extractLegacyVehicleInfo, type DecodedVinData } from './unifiedVinDecoder';

/**
 * Legacy VinDecoder interface for backwards compatibility
 * Maps to the old ain-valuation-frontend/src/services/vinDecoder.js format
 */
export interface LegacyVinResponse {
  make?: string;
  model?: string;
  modelYear?: number;
  trim?: string;
  bodyClass?: string;
  engineCylinders?: number;
  engineHP?: number;
  fuelTypePrimary?: string;
  driveType?: string;
  transmissionStyle?: string;
  manufacturer?: string;
  plantCountry?: string;
  errorCode?: string;
  errorText?: string;
}

/**
 * Migration wrapper for old vinDecoder.decodeVin() calls
 * Maintains backward compatibility while using new unified service
 * 
 * BEFORE (old way):
 * import { decodeVin } from '../services/vinDecoder';
 * const result = await decodeVin(vin);
 * 
 * AFTER (migration):
 * import { legacyDecodeVin } from '../services/vinMigration';
 * const result = await legacyDecodeVin(vin);
 */
export async function legacyDecodeVin(vin: string): Promise<LegacyVinResponse> {
  try {
    const result = await decodeVin(vin);
    return extractLegacyVehicleInfo(result);
  } catch (error) {
    // Return legacy error format
    return {
      errorCode: 'DECODE_ERROR',
      errorText: error.message || 'VIN decoding failed'
    };
  }
}

/**
 * Migration wrapper for old centralizedApi.decodeVin() calls
 * 
 * BEFORE (old way):
 * import { centralizedApi } from '../services/centralizedApi';
 * const result = await centralizedApi.decodeVin(vin);
 * 
 * AFTER (migration):
 * import { centralizedApiWrapper } from '../services/vinMigration';
 * const result = await centralizedApiWrapper.decodeVin(vin);
 */
export const centralizedApiWrapper = {
  async decodeVin(vin: string): Promise<LegacyVinResponse> {
    return legacyDecodeVin(vin);
  }
};

/**
 * Enhanced response format for new implementations
 * Use this for new code that can take advantage of the full unified response
 */
export async function enhancedDecodeVin(vin: string): Promise<{
  success: boolean;
  data?: DecodedVinData;
  legacy?: LegacyVinResponse;
  error?: string;
}> {
  try {
    const data = await decodeVin(vin);
    return {
      success: true,
      data,
      legacy: extractLegacyVehicleInfo(data)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      legacy: {
        errorCode: 'DECODE_ERROR',
        errorText: error.message
      }
    };
  }
}

/**
 * Migration checklist for developers
 */
export const MIGRATION_CHECKLIST = `
🔄 VIN Decoder Migration Checklist

📁 FILES TO UPDATE:
1. Remove old VIN decoder files:
   - ain-valuation-frontend/src/services/vinDecoder.js (410 lines)
   - src/ain-backend/vinDecoder.ts (6 lines)
   - src/api/decodeVin.ts/.js (if exists)

2. Update imports:
   ❌ OLD: import { decodeVin } from './services/vinDecoder'
   ✅ NEW: import { decodeVin } from './services/unifiedVinDecoder'
   
   ❌ OLD: import { centralizedApi } from './services/centralizedApi'
   ✅ NEW: import { decodeVin } from './services/unifiedVinDecoder'

3. Update function calls:
   ❌ OLD: const result = await decodeVin(vin)
   ✅ NEW: const result = await decodeVin(vin)
            const legacyData = extractLegacyVehicleInfo(result)

📋 FEATURES GAINED:
✅ Unified fallback logic (Supabase Edge → Direct NHTSA)
✅ Comprehensive error handling with specific error codes
✅ Categorized response data (identity, powertrain, manufacturing, safety, specs)
✅ Built-in VIN validation with checksum verification
✅ Configurable timeouts and retry logic
✅ TypeScript support with full type definitions
✅ Backwards compatibility with legacy response format

🧪 TESTING:
1. Run: npm test -- vinDecoder
2. Test VIN: 1HGBH41JXMN109186 (Honda Accord)
3. Test invalid VIN: 123 (should fail validation)
4. Test network timeout (long VIN decode)

🚀 DEPLOYMENT:
1. Update environment variables (VITE_SUPABASE_URL)
2. Verify Supabase edge function is deployed
3. Test fallback to direct NHTSA API
4. Monitor error rates in production

💡 BEST PRACTICES:
- Always validate VINs before decoding
- Use typed interfaces for new code
- Handle VINDecodeError specifically
- Log the data source (edge function vs direct API)
- Implement proper loading states in UI
`;

/**
 * Quick migration test function
 */
export async function testMigration() {
  const testVin = '1HGBH41JXMN109186';
  
  console.log('🧪 Testing VIN decoder migration...\n');
  
  try {
    // Test new unified decoder
    console.log('1️⃣ Testing unified decoder...');
    const unifiedResult = await decodeVin(testVin);
    console.log(`   ✅ Success via ${unifiedResult.metadata.source}`);
    console.log(`   🚗 Vehicle: ${unifiedResult.categories.identity.make} ${unifiedResult.categories.identity.model} ${unifiedResult.categories.identity.modelYear}`);
    
    // Test legacy compatibility
    console.log('\n2️⃣ Testing legacy compatibility...');
    const legacyResult = await legacyDecodeVin(testVin);
    console.log(`   ✅ Success: ${legacyResult.make} ${legacyResult.model} ${legacyResult.modelYear}`);
    
    // Test enhanced wrapper
    console.log('\n3️⃣ Testing enhanced wrapper...');
    const enhancedResult = await enhancedDecodeVin(testVin);
    if (enhancedResult.success) {
      console.log(`   ✅ Enhanced success with ${Object.keys(enhancedResult.data?.categories || {}).length} categories`);
    }
    
    console.log('\n🎉 All migration tests passed!');
    return true;
  } catch (error) {
    console.error('\n❌ Migration test failed:', error.message);
    return false;
  }
}

// Export migration utilities
export const MigrationUtils = {
  legacyWrapper: legacyDecodeVin,
  centralizedWrapper: centralizedApiWrapper,
  enhanced: enhancedDecodeVin,
  test: testMigration,
  checklist: MIGRATION_CHECKLIST
} as const;
