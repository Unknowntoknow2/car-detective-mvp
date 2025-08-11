// Test the frontend VIN decoder with direct API
import { decodeVIN } from './src/services/vinDecoder.js';

async function testFrontendDecoder() {
  const VIN = '4T1R11AK4RU878557';
  
  try {
    console.log('🧪 Testing frontend decoder with direct API fallback...');
    
    // Force direct API usage to bypass Supabase
    const result = await decodeVIN(VIN, { useDirectAPI: true });
    
    console.log('\n📊 Frontend Decoder Result:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n🎯 Specific Fields:');
    console.log(`Body Class: "${result.vehicleInfo.bodyClass}"`);
    console.log(`Manufacturer: "${result.vehicleInfo.manufacturer}"`);
    console.log(`Engine: ${result.vehicleInfo.engineInfo.cylinders} cyl, ${result.vehicleInfo.engineInfo.fuelType}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFrontendDecoder();
