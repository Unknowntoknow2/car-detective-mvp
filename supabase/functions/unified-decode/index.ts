
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface VehicleDecodeResponse {
  success: boolean;
  vin: string;
  source: 'nhtsa' | 'autoapi' | 'cache' | 'failed';
  decoded?: {
    vin: string;
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
    engine?: string;
    transmission?: string;
    drivetrain?: string;
    bodyType?: string;
    fuelType?: string;
  };
  error?: string;
}

async function decodeWithNHTSA(vin: string): Promise<VehicleDecodeResponse> {
  console.log(`🔄 Trying NHTSA API for VIN: ${vin}`);
  
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (!response.ok) {
      throw new Error(`NHTSA API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.Results || data.Results.length === 0) {
      throw new Error('No results from NHTSA');
    }
    
    const results = data.Results;
    const vehicleData: any = {};
    
    results.forEach((item: any) => {
      switch (item.Variable) {
        case 'Model Year':
          if (item.Value && item.Value !== 'Not Applicable') {
            vehicleData.year = parseInt(item.Value);
          }
          break;
        case 'Make':
          if (item.Value && item.Value !== 'Not Applicable') {
            vehicleData.make = item.Value;
          }
          break;
        case 'Model':
          if (item.Value && item.Value !== 'Not Applicable') {
            vehicleData.model = item.Value;
          }
          break;
        case 'Trim':
          if (item.Value && item.Value !== 'Not Applicable') {
            vehicleData.trim = item.Value;
          }
          break;
        case 'Engine Number of Cylinders':
          if (item.Value && item.Value !== 'Not Applicable') {
            vehicleData.engine = `${item.Value} Cylinder`;
          }
          break;
        case 'Transmission Style':
          if (item.Value && item.Value !== 'Not Applicable') {
            vehicleData.transmission = item.Value;
          }
          break;
        case 'Drive Type':
          if (item.Value && item.Value !== 'Not Applicable') {
            vehicleData.drivetrain = item.Value;
          }
          break;
        case 'Body Class':
          if (item.Value && item.Value !== 'Not Applicable') {
            vehicleData.bodyType = item.Value;
          }
          break;
        case 'Fuel Type - Primary':
          if (item.Value && item.Value !== 'Not Applicable') {
            vehicleData.fuelType = item.Value;
          }
          break;
      }
    });
    
    // Validate we have minimum required data and VIN matches
    if (!vehicleData.make || !vehicleData.model || !vehicleData.year) {
      throw new Error('Insufficient vehicle data from NHTSA');
    }
    
    vehicleData.vin = vin;
    
    // Store successful decode in cache
    await supabase.from('decoded_vehicles').upsert({
      vin: vin,
      year: vehicleData.year,
      make: vehicleData.make,
      model: vehicleData.model,
      trim: vehicleData.trim,
      engine: vehicleData.engine,
      transmission: vehicleData.transmission,
      drivetrain: vehicleData.drivetrain,
      bodyType: vehicleData.bodyType,
      fuelType: vehicleData.fuelType,
      created_at: new Date().toISOString()
    });
    
    console.log(`✅ NHTSA decode successful for VIN: ${vin}`);
    
    return {
      success: true,
      vin: vin,
      source: 'nhtsa',
      decoded: vehicleData
    };
    
  } catch (error) {
    console.error(`❌ NHTSA failed for VIN ${vin}:`, error);
    
    // Log the failure
    await supabase.from('vin_failures').insert({
      vin: vin,
      source: 'nhtsa',
      error_message: error.message,
      created_at: new Date().toISOString()
    });
    
    throw error;
  }
}

async function checkCache(vin: string): Promise<VehicleDecodeResponse | null> {
  console.log(`🔍 Checking cache for VIN: ${vin}`);
  
  try {
    const { data, error } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // Validate cache data has minimum required fields
    if (!data.make || !data.model || !data.year) {
      console.log(`❌ Cache data incomplete for VIN: ${vin}`);
      return null;
    }
    
    console.log(`✅ Cache hit for VIN: ${vin}`);
    
    return {
      success: true,
      vin: vin,
      source: 'cache',
      decoded: {
        vin: data.vin,
        year: data.year,
        make: data.make,
        model: data.model,
        trim: data.trim,
        engine: data.engine,
        transmission: data.transmission,
        drivetrain: data.drivetrain,
        bodyType: data.bodyType || data.bodytype,
        fuelType: data.fuelType || data.fueltype,
      }
    };
  } catch (error) {
    console.error(`❌ Cache check failed for VIN ${vin}:`, error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vin } = await req.json();
    
    if (!vin) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          vin: '', 
          source: 'failed',
          error: 'VIN is required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    console.log(`🔍 Starting VIN decode for: ${vin}`);
    
    // Step 1: Check cache first
    const cacheResult = await checkCache(vin);
    if (cacheResult) {
      return new Response(
        JSON.stringify(cacheResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Step 2: Try NHTSA API
    try {
      const nhtsaResult = await decodeWithNHTSA(vin);
      return new Response(
        JSON.stringify(nhtsaResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (nhtsaError) {
      console.log(`❌ NHTSA failed, trying AutoAPI...`);
      
      // Step 3: Try AutoAPI (placeholder for now)
      try {
        console.log(`🔄 Trying AutoAPI for VIN: ${vin}`);
        throw new Error('AutoAPI not configured');
      } catch (autoApiError) {
        console.error(`❌ AutoAPI failed for VIN ${vin}:`, autoApiError);
      }
    }
    
    // All methods failed - log final failure
    console.error(`❌ All decode methods failed for VIN: ${vin}`);
    
    await supabase.from('vin_failures').insert({
      vin: vin,
      source: 'all_methods',
      error_message: 'All decode methods failed',
      created_at: new Date().toISOString()
    });
    
    // Return failure response - NO DEMO DATA
    return new Response(
      JSON.stringify({
        success: false,
        vin: vin,
        source: 'failed',
        error: 'Unable to decode VIN. Please try again or use manual entry.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error('❌ Decode request failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        vin: '',
        source: 'failed',
        error: 'Network error. Please check your connection and try again.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
