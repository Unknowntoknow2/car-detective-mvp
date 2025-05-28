
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    
    console.log('🔍 Unified Decode: Processing VIN:', vin);
    
    if (!vin || vin.length !== 17) {
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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if we already have this VIN decoded
    const { data: existingVehicle } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin.toUpperCase())
      .single();

    if (existingVehicle) {
      console.log('✅ Found existing decoded vehicle:', existingVehicle);
      return new Response(
        JSON.stringify({
          success: true,
          vin: vin.toUpperCase(),
          source: 'cache',
          decoded: {
            vin: existingVehicle.vin,
            year: existingVehicle.year,
            make: existingVehicle.make,
            model: existingVehicle.model,
            trim: existingVehicle.trim,
            engine: existingVehicle.engine,
            transmission: existingVehicle.transmission,
            bodyType: existingVehicle.bodytype || existingVehicle.bodyType,
            fuelType: existingVehicle.fueltype,
            drivetrain: existingVehicle.drivetrain,
            engineCylinders: existingVehicle.enginecylinders,
            displacementL: existingVehicle.displacementl,
            seats: existingVehicle.seats,
            doors: existingVehicle.doors
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Decode VIN using NHTSA API
    console.log('🔍 Calling NHTSA API for VIN:', vin);
    
    const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;
    const nhtsaResponse = await fetch(nhtsaUrl);
    
    if (!nhtsaResponse.ok) {
      throw new Error(`NHTSA API error: ${nhtsaResponse.status}`);
    }
    
    const nhtsaData = await nhtsaResponse.json();
    
    if (!nhtsaData.Results || nhtsaData.Results.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No vehicle data found for this VIN',
          vin: vin.toUpperCase(),
          source: 'nhtsa'
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse NHTSA response
    const results = nhtsaData.Results;
    const getValue = (variableId: number) => {
      const result = results.find((r: any) => r.VariableId === variableId);
      return result?.Value || null;
    };

    const decodedVehicle = {
      vin: vin.toUpperCase(),
      year: parseInt(getValue(29)) || null, // Model Year
      make: getValue(26) || null, // Make
      model: getValue(28) || null, // Model
      trim: getValue(38) || null, // Trim
      engine: getValue(71) || null, // Engine Number of Cylinders
      transmission: getValue(37) || null, // Transmission Style
      bodytype: getValue(5) || null, // Body Class
      fueltype: getValue(24) || null, // Fuel Type - Primary
      drivetrain: getValue(9) || null, // Drive Type
      enginecylinders: getValue(71) || null, // Engine Number of Cylinders
      displacementl: getValue(67) || null, // Displacement (L)
      seats: getValue(33) || null, // Seating Capacity
      doors: getValue(14) || null, // Number of Doors
      timestamp: new Date().toISOString()
    };

    console.log('✅ Decoded vehicle data:', decodedVehicle);

    // Store in Supabase
    const { error: insertError } = await supabase
      .from('decoded_vehicles')
      .insert(decodedVehicle);

    if (insertError) {
      console.error('❌ Error storing decoded vehicle:', insertError);
      // Continue anyway, we still have the decoded data
    }

    return new Response(
      JSON.stringify({
        success: true,
        vin: vin.toUpperCase(),
        source: 'nhtsa',
        decoded: {
          vin: decodedVehicle.vin,
          year: decodedVehicle.year,
          make: decodedVehicle.make,
          model: decodedVehicle.model,
          trim: decodedVehicle.trim,
          engine: decodedVehicle.engine,
          transmission: decodedVehicle.transmission,
          bodyType: decodedVehicle.bodytype,
          fuelType: decodedVehicle.fueltype,
          drivetrain: decodedVehicle.drivetrain,
          engineCylinders: decodedVehicle.enginecylinders,
          displacementL: decodedVehicle.displacementl,
          seats: decodedVehicle.seats,
          doors: decodedVehicle.doors
        }
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
