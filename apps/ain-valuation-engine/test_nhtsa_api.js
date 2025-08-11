/**
 * Test NHTSA VIN decoding API
 * Verifies the direct API fallback works correctly
 */

async function testNHTSAApi() {
  console.log('🧪 Testing NHTSA VIN Decoding API...\n');
  
  const testVin = '1HGCM82633A000001'; // 2003 Honda Accord - more recent
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${testVin}?format=json`;
  
  try {
    console.log(`🌐 Calling NHTSA API: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AIN-Valuation-Engine/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.Results || !Array.isArray(data.Results) || data.Results.length === 0) {
      throw new Error('No results from NHTSA API');
    }

    const vehicle = data.Results[0];
    
    console.log('✅ NHTSA API Response received');
    console.log(`🚗 Vehicle: ${vehicle.Make} ${vehicle.Model} ${vehicle.ModelYear}`);
    console.log(`⚡ Engine: ${vehicle.EngineCylinders} cylinders`);
    console.log(`🛠️ Fuel: ${vehicle.FuelTypePrimary}`);
    console.log(`🏭 Made in: ${vehicle.PlantCountry}`);
    console.log(`📊 Body: ${vehicle.BodyClass}`);
    console.log(`🔧 Drive: ${vehicle.DriveType}`);
    console.log(`🎛️ Transmission: ${vehicle.TransmissionStyle}`);
    
    // Check for errors
    if (vehicle.ErrorCode && vehicle.ErrorCode !== '0') {
      console.log(`⚠️ Warning: ErrorCode ${vehicle.ErrorCode} - ${vehicle.ErrorText}`);
    } else {
      console.log('✅ No errors reported');
    }
    
    console.log('\n🎉 NHTSA API test successful!');
    return true;
    
  } catch (error) {
    console.error('\n❌ NHTSA API test failed:');
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

// Run the test
testNHTSAApi().then(success => {
  console.log(`\n🎯 Test result: ${success ? 'SUCCESS' : 'FAILED'}`);
});
