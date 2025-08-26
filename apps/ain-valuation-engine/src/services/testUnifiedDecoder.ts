/**
 * Test script for unified VIN decoder
 * Quick verification that all components work together
 */

import { validateVIN, normalizeVin } from './vinValidation';
import { decodeVin, VINDecodeError, extractLegacyVehicleInfo } from './unifiedVinDecoder';

async function runQuickTest() {
  console.log('🧪 Testing Unified VIN Decoder...\n');
  
  const testVin = '1HGBH41JXMN109186'; // Honda Accord
  
  try {
    // 1. Test validation
    console.log('1️⃣ Testing VIN validation...');
    const validation = validateVIN(testVin);
    console.log(`   Validation result: ${validation.valid ? '✅ Valid' : '❌ Invalid'}`);
    if (!validation.valid) {
      console.log(`   Error: ${validation.error}`);
      return;
    }
    
    // 2. Test normalization
    console.log('\n2️⃣ Testing VIN normalization...');
    const normalized = normalizeVin(' ' + testVin.toLowerCase() + ' ');
    console.log(`   Original: "${testVin}"`);
    console.log(`   Normalized: "${normalized}"`);
    
    // 3. Test decoding (with timeout for quick test)
    console.log('\n3️⃣ Testing VIN decoding...');
    const result = await decodeVin(testVin, { 
      timeout: 30000,        // 30 second timeout for testing
      forceDirectAPI: true   // Use direct API for reliable testing
    });
    
    console.log(`   ✅ Decode successful via: ${result.metadata.source}`);
    console.log(`   🚗 Vehicle: ${result.categories.identity.make} ${result.categories.identity.model} ${result.categories.identity.modelYear}`);
    console.log(`   ⚡ Engine: ${result.categories.powertrain.engineCylinders} cylinders, ${result.categories.powertrain.fuelTypePrimary} fuel`);
    console.log(`   🏭 Made in: ${result.categories.manufacturing.plantCountry}`);
    
    // 4. Test legacy compatibility
    console.log('\n4️⃣ Testing legacy compatibility...');
    const legacyInfo = extractLegacyVehicleInfo(result);
    console.log(`   Legacy format: ${legacyInfo.make} ${legacyInfo.model} ${legacyInfo.modelYear}`);
    
    console.log('\n🎉 All tests passed! Unified VIN decoder is working correctly.');
    return true;
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error instanceof VINDecodeError) {
      console.error(`   VIN Decode Error: ${error.code} - ${(error as any)?.message ?? String(error)}`);
      if (error.details) {
        console.error(`   Details:`, error.details);
      }
    } else {
      console.error(`   Unexpected error: ${(error as any)?.message ?? String(error)}`);
      console.error(`   Stack: ${(error as any)?.stack ?? ""}`);
    }
    return false;
  }
}

// Export for external testing
export { runQuickTest };

// Run test if executed directly
if (require.main === module) {
  runQuickTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}
