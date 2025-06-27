
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
    
    if (!vin || vin.length !== 17) {
      console.error('Invalid VIN format:', vin);
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

    const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;
    
    let nhtsaResponse;
    let nhtsaData;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      nhtsaResponse = await fetch(nhtsaUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'CarPerfector-Optimized/2.0',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!nhtsaResponse.ok) {
        console.error(`NHTSA API HTTP error: ${nhtsaResponse.status} ${nhtsaResponse.statusText}`);
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
      
    } catch (error) {
      console.error('NHTSA API network error:', error);
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
    
    if (!nhtsaData || !nhtsaData.Results || nhtsaData.Results.length === 0) {
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

    const results = nhtsaData.Results;
    
    const getValue = (variableId: number) => {
      const result = results.find((r: any) => r.VariableId === variableId);
      const value = result?.Value;
      return (value && value !== 'null' && value !== '') ? value : null;
    };

    // Extract vehicle data from NHTSA response
    const make = getValue(26);
    const model = getValue(28);
    const year = parseInt(getValue(29)) || null;
    const bodyClass = getValue(5);
    const fuelType = getValue(24);
    const transmission = getValue(37);
    const drivetrain = getValue(9);
    const engineCylinders = getValue(71);
    const displacement = getValue(67);
    const doors = getValue(14);
    const trim = getValue(38);
    const series = getValue(39);
    const vehicleType = getValue(10);

    if (!make || !model || make === 'null' || model === 'null' || make === '' || model === '') {
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
      seats: getValue(33),
      doors: doors
    };

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
    console.error('Unified Decode Error:', error);
    
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
