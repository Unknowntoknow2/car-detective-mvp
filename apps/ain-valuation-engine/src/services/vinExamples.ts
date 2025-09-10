/**
 * Unified VIN Decoder Usage Examples
 * Demonstrates how to use the new unified VIN decoding service
 */

import { decodeVin, validateVIN, VINDecodeError, extractLegacyVehicleInfo, isVinDecodeSuccessful } from './index';

/**
 * Example: Basic VIN decoding with error handling
 */
export async function basicVinExample() {
  const vin = '1HGBH41JXMN109186';
  
  try {
    // First validate the VIN format
    const validation = validateVIN(vin);
    if (!validation.valid) {
      console.error('❌ Invalid VIN:', validation.error);
      return null;
    }

    // Decode the VIN using unified service
    console.log('🔍 Decoding VIN:', vin);
    const result = await decodeVin(vin);
    
    // Check if decoding was successful
    if (!isVinDecodeSuccessful(result)) {
      console.error('❌ VIN decode failed:', result.metadata.errorText);
      return null;
    }

    console.log('✅ VIN decoded successfully via:', result.metadata.source);
    console.log('🚗 Vehicle:', result.categories.identity.make, result.categories.identity.model, result.categories.identity.modelYear);
    
    return result;
  } catch (error) {
    if (error instanceof VINDecodeError) {
      console.error('❌ VIN Decode Error:', (error as any)?.message ?? String(error), '(Code:', error.code, ')');
    } else {
      console.error('❌ Unexpected error:', error);
    }
    return null;
  }
}

/**
 * Example: Advanced VIN decoding with custom options
 */
export async function advancedVinExample() {
  const vin = '1HGBH41JXMN109186';
  
  const options = {
    timeout: 15000,     // 15 second timeout
    retries: 3,         // Retry 3 times on failure
    forceDirectAPI: false // Try edge function first
  };

  try {
    const result = await decodeVin(vin, options);
    
    if (isVinDecodeSuccessful(result)) {
      // Access categorized data
      console.log('🔧 Identity:', result.categories.identity);
      console.log('⚡ Powertrain:', result.categories.powertrain);
      console.log('🏭 Manufacturing:', result.categories.manufacturing);
      console.log('🛡️ Safety:', result.categories.safety);
      console.log('📊 Specifications:', result.categories.specifications);
      
      // Extract legacy format for backwards compatibility
      const legacyInfo = extractLegacyVehicleInfo(result);
      console.log('📜 Legacy format:', legacyInfo);
      
      return result;
    }
  } catch (error) {
    console.error('Decoding failed:', error);
    return null;
  }
}

/**
 * Example: Fallback demonstration
 */
export async function fallbackExample() {
  const vin = '1HGBH41JXMN109186';
  
  console.log('🧪 Testing fallback behavior...');
  
  // First try with edge function disabled to test direct API
  try {
    const directResult = await decodeVin(vin, { forceDirectAPI: true });
    console.log('✅ Direct NHTSA API worked:', directResult.metadata.source);
  } catch (error) {
    console.log('❌ Direct API failed:', (error as any)?.message ?? String(error));
  }
  
  // Then try normal flow (edge function → fallback)
  try {
    const normalResult = await decodeVin(vin);
    console.log('✅ Normal flow worked via:', normalResult.metadata.source);
    return normalResult;
  } catch (error) {
    console.log('❌ Both endpoints failed:', (error as any)?.message ?? String(error));
    return null;
  }
}

/**
 * Example: Batch VIN processing
 */
export async function batchVinExample() {
  const vins = [
    '1HGBH41JXMN109186', // Honda Accord
    '1G1BE5SM7H7155896', // Chevrolet Cruze  
    '3VW8T7AU9EM388202'  // Volkswagen Jetta
  ];

  console.log('📦 Processing batch of', vins.length, 'VINs...');
  
  const results = await Promise.allSettled(
    vins.map(async (vin) => {
      const validation = validateVIN(vin);
      if (!validation.valid) {
        throw new Error(`Invalid VIN format: ${vin}`);
      }
      
      return await decodeVin(vin, { timeout: 10000 });
    })
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log(`✅ Batch complete: ${successful} successful, ${failed} failed`);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const data = result.value;
      console.log(`🚗 VIN ${index + 1}: ${data.categories.identity.make} ${data.categories.identity.model} ${data.categories.identity.modelYear} (via ${data.metadata.source})`);
    } else {
      console.log(`❌ VIN ${index + 1}: ${result.reason.message}`);
    }
  });
  
  return results;
}

/**
 * Example: Error handling patterns
 */
export async function errorHandlingExample() {
  const testCases = [
    { vin: '', label: 'Empty VIN' },
    { vin: '123', label: 'Too short' },
    { vin: '1HGBH41JXMN109186EXTRA', label: 'Too long' },
    { vin: '1HGBH41JXMN109IOQ', label: 'Invalid characters (I,O,Q)' },
    { vin: '1HGBH41JXMN109187', label: 'Wrong checksum' },
    { vin: '1HGBH41JXMN109186', label: 'Valid VIN' }
  ];

  console.log('🧪 Testing error handling patterns...');
  
  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.label} (${testCase.vin})`);
    
    try {
      const validation = validateVIN(testCase.vin);
      console.log(`   Validation: ${validation.valid ? '✅' : '❌'} ${validation.error || 'Valid'}`);
      
      if (validation.valid) {
        const result = await decodeVin(testCase.vin, { timeout: 5000 });
        console.log(`   Decode: ✅ ${result.categories.identity.make} ${result.categories.identity.model} via ${result.metadata.source}`);
      }
    } catch (error) {
      if (error instanceof VINDecodeError) {
        console.log(`   Decode: ❌ ${error.code}: ${(error as any)?.message ?? String(error)}`);
      } else {
        console.log(`   Decode: ❌ Unexpected: ${(error as any)?.message ?? String(error)}`);
      }
    }
  }
}

// Export all examples for easy testing
export const VinExamples = {
  basic: basicVinExample,
  advanced: advancedVinExample,
  fallback: fallbackExample,
  batch: batchVinExample,
  errorHandling: errorHandlingExample
} as const;
