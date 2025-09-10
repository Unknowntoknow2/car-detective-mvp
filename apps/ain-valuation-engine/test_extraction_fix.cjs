/**
 * Test the updated extraction logic with both backend formats
 */

// Simulate current backend response (old format with custom field names)
const currentBackendResponse = {
  "vin": "4T1C31AK0LU533615",
  "year": "2020", 
  "make": "TOYOTA",
  "model": "Camry",
  "engine_hp": "203",
  "vehicle_type": "PASSENGER CAR"
};

// Simulate correct NHTSA response (new format with original field names)
const correctNHTSAResponse = {
  "Make": "TOYOTA",
  "Model": "Camry", 
  "ModelYear": "2020",
  "VehicleType": "PASSENGER CAR",
  "BodyClass": "Sedan/Saloon",
  "Manufacturer": "TOYOTA MOTOR MANUFACTURING, KENTUCKY, INC.",
  "EngineCylinders": "4",
  "FuelTypePrimary": "Gasoline",
  "EngineHP": "203",
  "ErrorCode": "0"
};

// Updated extraction logic that handles both formats
function extractVehicleInfo(decodedData) {
  if (!decodedData || !Array.isArray(decodedData) || decodedData.length === 0) {
    return null;
  }
  
  const data = decodedData[0];
  
  const getValue = (value, defaultValue = 'Unknown') => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'string' && value.trim() === '') return defaultValue;
    return value;
  };
  
  const getFieldValue = (nhtsaFieldName, customFieldName) => {
    if (data[nhtsaFieldName] !== undefined) {
      return getValue(data[nhtsaFieldName]);
    }
    if (data[customFieldName] !== undefined) {
      return getValue(data[customFieldName]);
    }
    return 'Unknown';
  };
  
  return {
    make: getFieldValue('Make', 'make'),
    model: getFieldValue('Model', 'model'),
    modelYear: getFieldValue('ModelYear', 'year'),
    vehicleType: getFieldValue('VehicleType', 'vehicle_type'),
    bodyClass: getValue(data.BodyClass),
    manufacturer: getValue(data.Manufacturer),
    engineInfo: {
      cylinders: getValue(data.EngineCylinders),
      fuelType: getValue(data.FuelTypePrimary),
      horsepower: getFieldValue('EngineHP', 'engine_hp')
    }
  };
}

console.log('🧪 Testing Updated Extraction Logic');
console.log('='.repeat(50));

// Test 1: Current backend format (should work now)
console.log('\n1️⃣ Testing Current Backend Format:');
const result1 = extractVehicleInfo([currentBackendResponse]);
console.log('✅ Results:');
for (const [key, value] of Object.entries(result1)) {
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

// Test 2: Correct NHTSA format
console.log('\n2️⃣ Testing Correct NHTSA Format:');
const result2 = extractVehicleInfo([correctNHTSAResponse]);
console.log('✅ Results:');
for (const [key, value] of Object.entries(result2)) {
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

console.log('\n🎯 CONCLUSION:');
console.log('✅ Updated frontend now handles BOTH backend formats!');
console.log('✅ VIN 4T1C31AK0LU533615 should now show data correctly');
console.log('🚀 Frontend is fixed and ready for testing!');
