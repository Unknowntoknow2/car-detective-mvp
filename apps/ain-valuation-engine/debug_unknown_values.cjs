/**
 * Simple JavaScript test to debug the Unknown values issue
 * This simulates the exact data that should be received by the frontend
 */

// Simulate the exact NHTSA response for VIN 4T1C31AK0LU533615
const simulatedNHTSAResponse = {
  "Make": "TOYOTA",
  "Model": "Camry", 
  "ModelYear": "2020",
  "VehicleType": "PASSENGER CAR",
  "BodyClass": "Sedan/Saloon",
  "Manufacturer": "TOYOTA MOTOR MANUFACTURING, KENTUCKY, INC.",
  "EngineCylinders": "4",
  "FuelTypePrimary": "Gasoline",
  "EngineHP": "203",
  "ErrorCode": "0",
  "ErrorText": "0 - VIN decoded clean. Check Digit (9th position) is correct"
};

// Our current frontend getValue function
function getValue(value, defaultValue = 'Unknown') {
  console.log(`getValue called with: "${value}" (type: ${typeof value})`);
  
  if (value === null || value === undefined) {
    console.log(`  -> returning default (null/undefined): "${defaultValue}"`);
    return defaultValue;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    console.log(`  -> returning default (empty string): "${defaultValue}"`);
    return defaultValue;
  }
  
  console.log(`  -> returning value: "${value}"`);
  return value;
}

// Test our extraction logic
function testExtraction() {
  console.log('🧪 Testing getValue function with NHTSA data');
  console.log('='.repeat(50));
  
  const decodedData = [simulatedNHTSAResponse]; // Wrap in array as expected
  
  if (!decodedData || !Array.isArray(decodedData) || decodedData.length === 0) {
    console.log('❌ Data structure check failed');
    return null;
  }
  
  console.log('✅ Data structure check passed');
  const data = decodedData[0];
  
  console.log('\\n🔍 Processing each field:');
  
  const extracted = {
    make: getValue(data.Make),
    model: getValue(data.Model),
    modelYear: getValue(data.ModelYear),
    vehicleType: getValue(data.VehicleType),
    bodyClass: getValue(data.BodyClass),
    manufacturer: getValue(data.Manufacturer),
    engineInfo: {
      cylinders: getValue(data.EngineCylinders),
      fuelType: getValue(data.FuelTypePrimary),
      horsepower: getValue(data.EngineHP)
    }
  };
  
  console.log('\\n📋 Final extracted data:');
  for (const [key, value] of Object.entries(extracted)) {
    if (typeof value === 'object') {
      console.log(`  ${key}:`);
      for (const [subKey, subValue] of Object.entries(value)) {
        const status = subValue === 'Unknown' ? '❌' : '✅';
        console.log(`    ${status} ${subKey}: "${subValue}"`);
      }
    } else {
      const status = value === 'Unknown' ? '❌' : '✅';
      console.log(`  ${status} ${key}: "${value}"`);
    }
  }
  
  // Count unknowns
  const unknownCount = Object.values(extracted).filter(v => v === 'Unknown').length +
                      Object.values(extracted.engineInfo).filter(v => v === 'Unknown').length;
  
  console.log(`\\n📊 Results:`);
  console.log(`   Unknown values: ${unknownCount}`);
  console.log(`   Expected result: ${unknownCount === 0 ? 'All fields populated' : 'Some fields Unknown'}`);
  
  return extracted;
}

// Test with potential data issues
function testEdgeCases() {
  console.log('\\n🔬 Testing edge cases:');
  
  const testCases = [
    { value: null, name: 'null' },
    { value: undefined, name: 'undefined' },
    { value: '', name: 'empty string' },
    { value: '   ', name: 'whitespace string' },
    { value: 'TOYOTA', name: 'normal string' },
    { value: 0, name: 'zero' },
    { value: false, name: 'false' }
  ];
  
  testCases.forEach(testCase => {
    console.log(`\\n  Testing ${testCase.name}:`);
    const result = getValue(testCase.value);
    console.log(`    Result: "${result}"`);
  });
}

console.log('🚗 VIN Data Extraction Debug Test');
console.log('Testing VIN: 4T1C31AK0LU533615');
console.log('='.repeat(60));

testExtraction();
testEdgeCases();

console.log('\\n🎯 CONCLUSION:');
console.log('If this test shows all ✅ marks, the frontend SHOULD work correctly.');
console.log('If you see ❌ marks, there is an issue with the getValue function or data structure.');

module.exports = { getValue, testExtraction };
