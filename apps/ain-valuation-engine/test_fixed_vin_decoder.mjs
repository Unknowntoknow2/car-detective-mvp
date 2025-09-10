// Test the fixed VIN decoder
import fetch from 'node-fetch';
global.fetch = fetch;

// Simulate the fixed vinDecoder logic
async function testFixedVINDecoder() {
  const VIN = '4T1R11AK4RU878557';
  
  console.log('🧪 Testing Fixed VIN Decoder (Direct NHTSA API)...');
  
  try {
    // Direct NHTSA API call (what the frontend now uses)
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${VIN.trim().toUpperCase()}?format=json`;
    console.log(`🌐 Direct NHTSA call: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NHTSA API error: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.Results || data.Results.length === 0) {
      throw new Error('No results from NHTSA');
    }
    
    // Extract vehicle info using the same logic as frontend
    const result = data.Results[0];
    
    const getValue = (value, defaultValue = 'Unknown') => {
      if (value === null || value === undefined) return defaultValue;
      if (typeof value === 'string' && value.trim() === '') return defaultValue;
      return value;
    };
    
    const vehicleInfo = {
      make: getValue(result.Make),
      model: getValue(result.Model),
      modelYear: getValue(result.ModelYear),
      bodyClass: getValue(result.BodyClass),
      manufacturer: getValue(result.Manufacturer),
      engineInfo: {
        cylinders: getValue(result.EngineCylinders),
        displacement: getValue(result.DisplacementL),
        fuelType: getValue(result.FuelTypePrimary),
        horsepower: getValue(result.EngineHP)
      }
    };
    
    console.log('\n✅ Fixed VIN Decoder Results:');
    console.log(`Make: ${vehicleInfo.make}`);
    console.log(`Model: ${vehicleInfo.model}`);
    console.log(`Year: ${vehicleInfo.modelYear}`);
    console.log(`Body Class: ${vehicleInfo.bodyClass}`);
    console.log(`Manufacturer: ${vehicleInfo.manufacturer}`);
    console.log(`Engine: ${vehicleInfo.engineInfo.cylinders} cyl, ${vehicleInfo.engineInfo.fuelType}`);
    
    console.log('\n🎯 Expected Frontend Display:');
    console.log(`Body Class: ${vehicleInfo.bodyClass} (was: Unknown)`);
    console.log(`Manufacturer: ${vehicleInfo.manufacturer} (was: Unknown)`);
    console.log(`Engine: ${vehicleInfo.engineInfo.cylinders} cyl, ${vehicleInfo.engineInfo.fuelType} (was: Unknown cyl, Unknown)`);
    
    // Quality assessment
    const missingFields = [];
    if (vehicleInfo.bodyClass === 'Unknown') missingFields.push('Body Class');
    if (vehicleInfo.manufacturer === 'Unknown') missingFields.push('Manufacturer');
    if (vehicleInfo.engineInfo.cylinders === 'Unknown') missingFields.push('Engine Cylinders');
    if (vehicleInfo.engineInfo.fuelType === 'Unknown') missingFields.push('Fuel Type');
    
    console.log('\n📊 Quality Assessment:');
    if (missingFields.length === 0) {
      console.log('✅ ALL FIELDS EXTRACTED SUCCESSFULLY!');
      console.log('🎉 Gap between audit and reality: RESOLVED');
    } else {
      console.log(`❌ Still missing: ${missingFields.join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFixedVINDecoder();
