// Test VIN decoding to identify the gap
async function testVINDecoding() {
  const VIN = '4T1R11AK4RU878557';
  
  try {
    console.log('🔍 Testing direct NHTSA API...');
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${VIN}?format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Results && data.Results.length > 0) {
      const result = data.Results[0];
      console.log('\n📊 Raw NHTSA Response (key fields):');
      console.log(`Make: "${result.Make}"`);
      console.log(`Model: "${result.Model}"`);
      console.log(`ModelYear: "${result.ModelYear}"`);
      console.log(`BodyClass: "${result.BodyClass}"`);
      console.log(`Manufacturer: "${result.Manufacturer}"`);
      console.log(`EngineCylinders: "${result.EngineCylinders}"`);
      console.log(`EngineHP: "${result.EngineHP}"`);
      console.log(`FuelTypePrimary: "${result.FuelTypePrimary}"`);
      console.log(`DisplacementL: "${result.DisplacementL}"`);
      
      // Test the field extraction logic
      const getValue = (value, defaultValue = 'Unknown') => {
        if (value === null || value === undefined) return defaultValue;
        if (typeof value === 'string' && value.trim() === '') return defaultValue;
        return value;
      };
      
      const extracted = {
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
      
      console.log('\n🎯 Extracted Vehicle Info:');
      console.log(JSON.stringify(extracted, null, 2));
      
    } else {
      console.log('❌ No results from NHTSA API');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testVINDecoding();
