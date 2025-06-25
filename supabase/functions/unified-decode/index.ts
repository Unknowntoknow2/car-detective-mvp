
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vin } = await req.json();
    
    console.log('🔍 Direct NHTSA Decode: Processing VIN:', vin);
    
    if (!vin || vin.length !== 17) {
      console.error('❌ Invalid VIN format:', vin);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid VIN format. VIN must be 17 characters long.',
          vin,
          source: 'validation'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Always decode VIN using NHTSA API directly
    console.log('🔍 Calling NHTSA API for VIN:', vin);
    
    const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;
    
    let nhtsaResponse;
    let nhtsaData;
    let nhtsaFailed = false;
    
    try {
      // Add timeout to NHTSA API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      nhtsaResponse = await fetch(nhtsaUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'VehicleDecoder/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!nhtsaResponse.ok) {
        console.error(`🚨 NHTSA API HTTP error: ${nhtsaResponse.status} ${nhtsaResponse.statusText}`);
        nhtsaFailed = true;
      } else {
        nhtsaData = await nhtsaResponse.json();
        console.log('📊 NHTSA API raw response:', JSON.stringify(nhtsaData, null, 2));
      }
      
    } catch (error) {
      console.error('🚨 NHTSA API network error:', error);
      nhtsaFailed = true;
    }
    
    // Check if NHTSA data is valid
    if (nhtsaFailed || !nhtsaData || !nhtsaData.Results || nhtsaData.Results.length === 0) {
      console.error('❌ No valid data from NHTSA API');
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'NHTSA API temporarily unavailable or returned no data',
          vin: vin.toUpperCase(),
          source: 'nhtsa_failed'
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse NHTSA response
    const results = nhtsaData.Results;
    console.log('📋 NHTSA Results count:', results.length);
    
    const getValue = (variableId: number) => {
      const result = results.find((r: any) => r.VariableId === variableId);
      const value = result?.Value;
      console.log(`📝 Variable ${variableId}: "${value}"`);
      return value || null;
    };

    // Extract key vehicle data from NHTSA response
    const make = getValue(26); // Make
    const model = getValue(28); // Model
    const year = parseInt(getValue(29)) || null; // Model Year
    const bodyClass = getValue(5); // Body Class
    const fuelType = getValue(24); // Fuel Type - Primary
    const transmission = getValue(37); // Transmission Style
    const drivetrain = getValue(9); // Drive Type
    const engineCylinders = getValue(71); // Engine Number of Cylinders
    const displacement = getValue(67); // Displacement (L)
    const doors = getValue(14); // Number of Doors
    const trim = getValue(38); // Trim

    console.log('🔍 NHTSA parsed data:', { make, model, year, bodyClass, fuelType });

    // Check if NHTSA data is incomplete or invalid
    if (!make || !model || make === 'null' || model === 'null' || make === '' || model === '') {
      console.log('⚠️ NHTSA data incomplete or invalid');
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'NHTSA returned incomplete vehicle data',
          vin: vin.toUpperCase(),
          source: 'nhtsa_incomplete'
        }),
        { 
          status: 422, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build decoded vehicle data from NHTSA response
    const decodedVehicle = {
      vin: vin.toUpperCase(),
      year: year,
      make: make,
      model: model,
      trim: trim || 'Standard',
      engine: engineCylinders ? `${engineCylinders}-Cylinder` : null,
      transmission: transmission,
      bodyType: bodyClass,
      fuelType: fuelType,
      drivetrain: drivetrain,
      engineCylinders: engineCylinders,
      displacementL: displacement,
      seats: getValue(33), // Seating Capacity
      doors: doors
    };

    console.log('✅ Final NHTSA decoded vehicle data:', decodedVehicle);

    return new Response(
      JSON.stringify({
        success: true,
        vin: vin.toUpperCase(),
        source: 'nhtsa',
        decoded: decodedVehicle
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Unified Decode Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        vin: '',
        source: 'error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
