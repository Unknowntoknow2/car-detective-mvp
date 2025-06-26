
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
    
    console.log('🔍 OPTIMIZED NHTSA Decode: Processing VIN:', vin);
    
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

    // Optimized NHTSA API call with enhanced error handling
    console.log('🚀 Making optimized NHTSA API call for VIN:', vin);
    
    const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;
    console.log('📡 NHTSA URL:', nhtsaUrl);
    
    let nhtsaResponse;
    let nhtsaData;
    
    try {
      // Optimized API call with 8 second timeout for maximum speed
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      console.log('⚡ Making ultra-fast NHTSA API call with 8s timeout...');
      const startTime = Date.now();
      
      nhtsaResponse = await fetch(nhtsaUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'CarPerfector-Optimized/2.0',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      const endTime = Date.now();
      console.log(`📊 OPTIMIZED NHTSA API call completed in ${endTime - startTime}ms`);
      console.log('📊 NHTSA API response status:', nhtsaResponse.status);
      
      if (!nhtsaResponse.ok) {
        console.error(`🚨 NHTSA API HTTP error: ${nhtsaResponse.status} ${nhtsaResponse.statusText}`);
        return new Response(
          JSON.stringify({
            success: false,
            error: `NHTSA API returned ${nhtsaResponse.status}: ${nhtsaResponse.statusText}`,
            vin: vin.toUpperCase(),
            source: 'nhtsa_error'
          }),
          { 
            status: 503, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      nhtsaData = await nhtsaResponse.json();
      console.log('📊 OPTIMIZED NHTSA API raw response size:', JSON.stringify(nhtsaData).length, 'characters');
      console.log('📊 NHTSA Results count:', nhtsaData?.Results?.length || 0);
      
    } catch (error) {
      console.error('🚨 OPTIMIZED NHTSA API network error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'NHTSA API network error: ' + error.message,
          vin: vin.toUpperCase(),
          source: 'network_error'
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Enhanced validation of NHTSA data
    if (!nhtsaData || !nhtsaData.Results || nhtsaData.Results.length === 0) {
      console.error('❌ No valid data from OPTIMIZED NHTSA API');
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'NHTSA API returned no data for this VIN',
          vin: vin.toUpperCase(),
          source: 'nhtsa_no_data'
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Enhanced NHTSA response parsing with improved data extraction
    const results = nhtsaData.Results;
    console.log('📋 Processing OPTIMIZED NHTSA Results with enhanced extraction...');
    
    const getValue = (variableId: number) => {
      const result = results.find((r: any) => r.VariableId === variableId);
      const value = result?.Value;
      if (value && value !== 'null' && value !== '') {
        console.log(`📝 Enhanced Variable ${variableId}: "${value}"`);
      }
      return (value && value !== 'null' && value !== '') ? value : null;
    };

    // Extract enhanced vehicle data from NHTSA response
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
    const series = getValue(39); // Series
    const vehicleType = getValue(10); // Vehicle Type

    console.log('🔍 OPTIMIZED NHTSA extracted data:', { 
      make, model, year, bodyClass, fuelType, transmission, drivetrain, trim, series 
    });

    // Enhanced validation of NHTSA data completeness
    if (!make || !model || make === 'null' || model === 'null' || make === '' || model === '') {
      console.log('⚠️ OPTIMIZED NHTSA data incomplete - make or model missing');
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'NHTSA returned incomplete vehicle data - missing make or model',
          vin: vin.toUpperCase(),
          source: 'nhtsa_incomplete',
          rawData: { make, model, year, bodyClass, trim, series }
        }),
        { 
          status: 422, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build enhanced decoded vehicle data from NHTSA response
    const decodedVehicle = {
      vin: vin.toUpperCase(),
      year: year,
      make: make,
      model: model,
      trim: trim || series || 'Standard',
      engine: engineCylinders ? `${engineCylinders}-Cylinder` : null,
      transmission: transmission,
      bodyType: bodyClass || vehicleType,
      fuelType: fuelType,
      drivetrain: drivetrain,
      engineCylinders: engineCylinders,
      displacementL: displacement,
      seats: getValue(33), // Seating Capacity
      doors: doors
    };

    console.log('✅ OPTIMIZED Final NHTSA decoded vehicle data:', decodedVehicle);

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
    console.error('❌ OPTIMIZED Unified Decode Error:', error);
    
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
