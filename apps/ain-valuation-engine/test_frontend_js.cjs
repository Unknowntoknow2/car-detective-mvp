#!/usr/bin/env node
/**
 * Node.js test to simulate exact frontend JavaScript execution
 * This will help identify the frontend issue
 */

// Simulate browser fetch
const fetch = require('node-fetch');

// VIN validation (copied from frontend)
const TRANSLITERATION = {
  ...Object.fromEntries(Array.from({length: 10}, (_, i) => [i.toString(), i])),
  "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8,
  "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "P": 7, "R": 9,
  "S": 2, "T": 3, "U": 4, "V": 5, "W": 6, "X": 7, "Y": 8, "Z": 9
};

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

function validateVIN(vin) {
  if (!vin || typeof vin !== "string") {
    return { valid: false, error: "VIN must be a string" };
  }
  
  const cleanVin = vin.trim().toUpperCase();
  
  if (cleanVin.length !== 17) {
    return { valid: false, error: "VIN must be exactly 17 characters" };
  }
  
  if (!VIN_REGEX.test(cleanVin)) {
    return { valid: false, error: "VIN contains invalid characters (excludes I, O, Q)" };
  }
  
  let total = 0;
  for (let i = 0; i < 17; i++) {
    const char = cleanVin[i];
    const value = TRANSLITERATION[char];
    if (value === undefined) {
      return { valid: false, error: `Invalid character: ${char}` };
    }
    total += value * WEIGHTS[i];
  }
  
  const remainder = total % 11;
  const expectedCheckDigit = remainder === 10 ? "X" : remainder.toString();
  const actualCheckDigit = cleanVin[8];
  
  if (expectedCheckDigit !== actualCheckDigit) {
    return { 
      valid: false, 
      error: `Check digit mismatch (expected ${expectedCheckDigit}, got ${actualCheckDigit})` 
    };
  }
  
  return { valid: true };
}

// Direct NHTSA API call (copied from frontend)
async function decodeVINDirect(vin, options = {}) {
  const { timeout = 10000 } = options;
  
  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin.trim().toUpperCase()}?format=json`;
    console.log(`🌐 Direct NHTSA call: ${url}`);
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`NHTSA API error: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.Results || data.Results.length === 0) {
      throw new Error('No results from NHTSA');
    }
    
    return {
      success: true,
      vin: vin.trim().toUpperCase(),
      data: data.Results,
      timestamp: new Date().toISOString(),
      source: 'NHTSA_VPIC_DIRECT'
    };
    
  } catch (error) {
    throw error;
  }
}

// Frontend extraction logic (copied exactly)
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
  
  return {
    make: getValue(data.Make),
    model: getValue(data.Model),
    modelYear: getValue(data.ModelYear),
    vehicleType: getValue(data.VehicleType),
    bodyClass: getValue(data.BodyClass),
    manufacturer: getValue(data.Manufacturer),
    engineInfo: {
      cylinders: getValue(data.EngineCylinders),
      displacement: getValue(data.DisplacementCC) !== 'Unknown' ? getValue(data.DisplacementCC) : getValue(data.DisplacementL),
      fuelType: getValue(data.FuelTypePrimary),
      horsepower: getValue(data.EngineHP)
    }
  };
}

async function testFrontendFlow() {
  const vin = '4T1C31AK0LU533615';
  
  console.log('🚗 Testing Frontend JavaScript Flow');
  console.log('='*50);
  
  try {
    // Step 1: Validation
    console.log('\n1️⃣ VIN Validation:');
    const validation = validateVIN(vin);
    console.log(`   Valid: ${validation.valid}`);
    if (!validation.valid) {
      console.log(`   Error: ${validation.error}`);
      return;
    }
    
    // Step 2: API Call
    console.log('\n2️⃣ API Call:');
    const result = await decodeVINDirect(vin);
    console.log(`   Success: ${result.success}`);
    console.log(`   Source: ${result.source}`);
    console.log(`   Data length: ${result.data.length}`);
    
    // Step 3: Data Extraction
    console.log('\n3️⃣ Data Extraction:');
    const vehicleInfo = extractVehicleInfo(result.data);
    
    if (vehicleInfo) {
      console.log('   ✅ Extraction successful!');
      
      const fields = ['make', 'model', 'modelYear', 'vehicleType', 'bodyClass', 'manufacturer'];
      for (const field of fields) {
        const value = vehicleInfo[field];
        const status = value === 'Unknown' ? '❌' : '✅';
        console.log(`   ${status} ${field}: "${value}"`);
      }
      
      // Engine info
      console.log('   Engine Info:');
      for (const [key, value] of Object.entries(vehicleInfo.engineInfo)) {
        const status = value === 'Unknown' ? '❌' : '✅';
        console.log(`   ${status} ${key}: "${value}"`);
      }
      
      const unknownCount = fields.filter(f => vehicleInfo[f] === 'Unknown').length +
                          Object.values(vehicleInfo.engineInfo).filter(v => v === 'Unknown').length;
      
      console.log(`\n   📊 Summary: ${fields.length + 4 - unknownCount}/${fields.length + 4} fields populated`);
      
      if (unknownCount === 0) {
        console.log('   🎉 SUCCESS: Frontend should show all data correctly!');
      } else {
        console.log(`   ⚠️  Issue: ${unknownCount} fields will show as Unknown`);
      }
      
    } else {
      console.log('   ❌ Extraction returned null');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

if (require.main === module) {
  testFrontendFlow();
}
