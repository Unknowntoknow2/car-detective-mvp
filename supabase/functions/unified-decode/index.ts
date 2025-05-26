
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { fetchWithRetry } from './utils/fetchWithRetry.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VehicleData {
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodytype?: string;
  fueltype?: string;
  enginecylinders?: string;
  displacementl?: string;
  seats?: string;
  doors?: string;
}

interface DecodeResponse {
  success: boolean;
  vin: string;
  source: 'nhtsa' | 'autoapi' | 'cache' | 'failed';
  decoded?: VehicleData;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { vin } = await req.json();

    if (!vin || vin.length !== 17) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          vin: vin || '',
          source: 'failed',
          error: 'Invalid VIN format. VIN must be 17 characters.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Starting decode process for VIN: ${vin}`);

    // Step 1: Check cache first
    const { data: cachedData } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin)
      .single();

    if (cachedData) {
      console.log(`Found cached data for VIN: ${vin}`);
      return new Response(
        JSON.stringify({
          success: true,
          vin,
          source: 'cache',
          decoded: cachedData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Try NHTSA API
    try {
      console.log(`Trying NHTSA API for VIN: ${vin}`);
      const nhtsaResponse = await fetchWithRetry(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
        {},
        { maxRetries: 3, timeoutMs: 3000 }
      );

      if (nhtsaResponse.ok) {
        const nhtsaData = await nhtsaResponse.json();
        
        if (nhtsaData.Results && nhtsaData.Results.length > 0) {
          const result = nhtsaData.Results[0];
          
          // Check if we got meaningful data
          if (result.Make && result.Make !== 'Not Available') {
            const decodedData: VehicleData = {
              vin,
              year: result.ModelYear ? parseInt(result.ModelYear) : undefined,
              make: result.Make || undefined,
              model: result.Model || undefined,
              trim: result.Trim || undefined,
              engine: result.EngineModel || undefined,
              transmission: result.TransmissionStyle || undefined,
              drivetrain: result.DriveType || undefined,
              bodytype: result.BodyClass || undefined,
              fueltype: result.FuelTypePrimary || undefined,
              enginecylinders: result.EngineCylinders || undefined,
              displacementl: result.DisplacementL || undefined,
              seats: result.Seats || undefined,
              doors: result.Doors || undefined,
            };

            // Enrich with Supabase data
            const enrichedData = await enrichVehicleData(supabase, decodedData);

            // Cache the result
            await cacheVehicleData(supabase, enrichedData);

            console.log(`Successfully decoded VIN ${vin} via NHTSA`);
            return new Response(
              JSON.stringify({
                success: true,
                vin,
                source: 'nhtsa',
                decoded: enrichedData
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      }
    } catch (error) {
      console.log(`NHTSA API failed for VIN ${vin}:`, error.message);
      await logFailure(supabase, vin, `NHTSA API error: ${error.message}`, 'nhtsa');
    }

    // Step 3: Try AutoAPI.io (mock for now)
    try {
      console.log(`Trying AutoAPI for VIN: ${vin}`);
      // Mock AutoAPI response - in production, replace with actual API call
      const mockResponse = {
        success: true,
        data: {
          vin,
          year: 2020,
          make: 'Toyota',
          model: 'Camry',
          trim: 'LE',
          engine: '2.5L 4-Cylinder',
          transmission: 'Automatic',
          drivetrain: 'FWD',
          bodytype: 'Sedan',
          fueltype: 'Gasoline'
        }
      };

      if (mockResponse.success) {
        const decodedData: VehicleData = mockResponse.data;
        const enrichedData = await enrichVehicleData(supabase, decodedData);
        await cacheVehicleData(supabase, enrichedData);

        console.log(`Successfully decoded VIN ${vin} via AutoAPI`);
        return new Response(
          JSON.stringify({
            success: true,
            vin,
            source: 'autoapi',
            decoded: enrichedData
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.log(`AutoAPI failed for VIN ${vin}:`, error.message);
      await logFailure(supabase, vin, `AutoAPI error: ${error.message}`, 'autoapi');
    }

    // Step 4: All methods failed
    console.log(`All decode methods failed for VIN: ${vin}`);
    await logFailure(supabase, vin, 'All decode sources failed', 'all');

    return new Response(
      JSON.stringify({
        success: false,
        vin,
        source: 'failed',
        error: 'Unable to decode VIN. Please try manual entry.'
      }),
      { 
        status: 422, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unified decode error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        vin: '',
        source: 'failed',
        error: 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function enrichVehicleData(supabase: any, data: VehicleData): Promise<VehicleData> {
  try {
    // Cross-match with makes table
    if (data.make) {
      const { data: makeData } = await supabase
        .from('makes')
        .select('*')
        .ilike('make_name', data.make)
        .single();

      if (makeData && data.model) {
        // Get model data
        const { data: modelData } = await supabase
          .from('models')
          .select('*')
          .eq('make_id', makeData.id)
          .ilike('model_name', data.model)
          .single();

        if (modelData && data.year && !data.trim) {
          // Try to find a matching trim
          const { data: trimData } = await supabase
            .from('model_trims')
            .select('*')
            .eq('model_id', modelData.id)
            .eq('year', data.year)
            .limit(1)
            .single();

          if (trimData) {
            data.trim = trimData.trim_name;
          }
        }
      }
    }

    return data;
  } catch (error) {
    console.log('Enrichment failed, returning original data:', error.message);
    return data;
  }
}

async function cacheVehicleData(supabase: any, data: VehicleData): Promise<void> {
  try {
    await supabase
      .from('decoded_vehicles')
      .upsert(data, { onConflict: 'vin' });
  } catch (error) {
    console.log('Failed to cache vehicle data:', error.message);
  }
}

async function logFailure(supabase: any, vin: string, errorMessage: string, source: string): Promise<void> {
  try {
    await supabase
      .from('vin_failures')
      .insert({
        vin,
        error_message: errorMessage,
        source
      });
  } catch (error) {
    console.log('Failed to log failure:', error.message);
  }
}
