
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { corsHeaders } from "../_shared/cors.ts";
import { fetchWithRetry } from "./utils/fetchWithRetry.ts";

interface VehicleDecodeResponse {
  success: boolean;
  vin: string;
  source: 'nhtsa' | 'autoapi' | 'cache' | 'failed';
  decoded?: any;
  error?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vin } = await req.json();
    
    if (!vin || vin.length !== 17) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          vin: vin || '', 
          source: 'failed', 
          error: 'Invalid VIN format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log(`🔍 Starting VIN decode for: ${vin}`);

    // Step 1: Check cache first
    const { data: cachedData } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin)
      .single();

    if (cachedData) {
      console.log(`✅ Found cached data for VIN: ${vin}`);
      return new Response(
        JSON.stringify({
          success: true,
          vin,
          source: 'cache',
          decoded: {
            vin: cachedData.vin,
            make: cachedData.make,
            model: cachedData.model,
            year: cachedData.year,
            trim: cachedData.trim,
            engine: cachedData.engine,
            transmission: cachedData.transmission,
            drivetrain: cachedData.drivetrain,
            bodyType: cachedData.bodytype || cachedData.bodyType,
            fuelType: cachedData.fueltype,
            doors: cachedData.doors,
            seats: cachedData.seats,
            engineCylinders: cachedData.enginecylinders,
            displacementL: cachedData.displacementl
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Try NHTSA API
    console.log(`🔄 Trying NHTSA API for VIN: ${vin}`);
    try {
      const nhtsaResponse = await fetchWithRetry(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
        { method: 'GET' },
        { maxRetries: 3, timeoutMs: 5000 }
      );

      if (nhtsaResponse.ok) {
        const nhtsaData = await nhtsaResponse.json();
        const result = nhtsaData.Results?.[0];
        
        if (result && result.Make && result.Model) {
          console.log(`✅ NHTSA decode successful for VIN: ${vin}`);
          
          const decodedVehicle = {
            vin,
            make: result.Make,
            model: result.Model,
            year: parseInt(result.ModelYear) || null,
            trim: result.Trim || null,
            engine: result.EngineModel || result.EnginePowerPS || null,
            transmission: result.TransmissionStyle || 'Automatic',
            drivetrain: result.DriveType || 'FWD',
            bodyType: result.BodyClass || null,
            fuelType: result.FuelTypePrimary || 'Gasoline',
            doors: result.Doors || null,
            seats: result.Seats || null,
            engineCylinders: result.EngineCylinders || null,
            displacementL: result.DisplacementL || null
          };

          // Cache the result
          await supabase.from('decoded_vehicles').insert({
            vin: decodedVehicle.vin,
            make: decodedVehicle.make,
            model: decodedVehicle.model,
            year: decodedVehicle.year,
            trim: decodedVehicle.trim,
            engine: decodedVehicle.engine,
            transmission: decodedVehicle.transmission,
            drivetrain: decodedVehicle.drivetrain,
            bodytype: decodedVehicle.bodyType,
            fueltype: decodedVehicle.fuelType,
            doors: decodedVehicle.doors,
            seats: decodedVehicle.seats,
            enginecylinders: decodedVehicle.engineCylinders,
            displacementl: decodedVehicle.displacementL
          });

          return new Response(
            JSON.stringify({
              success: true,
              vin,
              source: 'nhtsa',
              decoded: decodedVehicle
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    } catch (nhtsaError) {
      console.error(`❌ NHTSA API failed for VIN ${vin}:`, nhtsaError);
      
      // Log the failure
      await supabase.from('vin_failures').insert({
        vin,
        error_message: nhtsaError.message || 'NHTSA API timeout or error',
        source: 'nhtsa'
      });
    }

    // Step 3: Try AutoAPI (mock for now)
    console.log(`🔄 Trying AutoAPI for VIN: ${vin}`);
    try {
      // Mock AutoAPI call - replace with real API when available
      const mockAutoAPIData = {
        vin,
        make: null, // Will be populated from actual API
        model: null,
        year: null,
        trim: null
      };

      // Since we don't have real AutoAPI yet, this will fail
      throw new Error('AutoAPI not configured');
    } catch (autoApiError) {
      console.error(`❌ AutoAPI failed for VIN ${vin}:`, autoApiError);
      
      await supabase.from('vin_failures').insert({
        vin,
        error_message: autoApiError.message || 'AutoAPI not available',
        source: 'autoapi'
      });
    }

    // Step 4: Final fallback - log complete failure
    console.error(`❌ All decode methods failed for VIN: ${vin}`);
    
    await supabase.from('vin_failures').insert({
      vin,
      error_message: 'All decode methods failed - NHTSA and AutoAPI unavailable',
      source: 'failed'
    });

    return new Response(
      JSON.stringify({
        success: false,
        vin,
        source: 'failed',
        error: 'Unable to decode VIN. All external services are currently unavailable. Please try again later or use manual entry.'
      }),
      { 
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error('❌ Unified decode error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        vin: '',
        source: 'failed',
        error: 'Internal server error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
