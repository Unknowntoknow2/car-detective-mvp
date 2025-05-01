
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("NHTSA vPIC Decoder function loaded");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { vin } = await req.json();

    // Validate the VIN
    if (!vin || typeof vin !== 'string' || vin.length !== 17) {
      return new Response(
        JSON.stringify({ error: 'Invalid VIN. Must be a 17-character string.' }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    console.log(`Checking NHTSA vPIC data for VIN: ${vin}`);

    // First check if we have a cached entry for this VIN
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check the cache
    const { data: cachedData, error: cacheError } = await supabaseClient
      .from('vpic_cache')
      .select('vpic_data, fetched_at')
      .eq('vin', vin)
      .single();

    // If we have cache data and it's less than 30 days old, return it
    if (cachedData && !cacheError) {
      const fetchedAt = new Date(cachedData.fetched_at);
      const now = new Date();
      const cacheAge = now.getTime() - fetchedAt.getTime();
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

      if (cacheAge < thirtyDaysInMs) {
        console.log(`Returning cached vPIC data for VIN ${vin}`);
        return new Response(
          JSON.stringify({ 
            data: cachedData.vpic_data,
            source: 'cache',
            fetched_at: cachedData.fetched_at
          }),
          { 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }
    }

    // Fetch from NHTSA vPIC API
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`;
    console.log(`Fetching from NHTSA vPIC API: ${url}`);

    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`NHTSA API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          error: `NHTSA API error: ${response.status} ${response.statusText}`
        }),
        { 
          status: response.status === 404 ? 404 : 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    // Parse the response
    const rawData = await response.json();
    
    if (!rawData.Results || rawData.Results.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No data returned from NHTSA API'
        }),
        { 
          status: 404,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    // Structured response data
    const result = rawData.Results[0];
    const data = {
      vin: vin,
      make: result.Make || null,
      model: result.Model || null,
      modelYear: result.ModelYear ? parseInt(result.ModelYear, 10) : null,
      vehicleType: result.VehicleType || null,
      bodyClass: result.BodyClass || null,
      driveType: result.DriveType || null,
      fuelType: result.FuelTypePrimary || null,
      engineSize: result.DisplacementL ? parseFloat(result.DisplacementL) : null,
      engineCylinders: result.EngineCylinders ? parseInt(result.EngineCylinders, 10) : null,
      transmissionStyle: result.TransmissionStyle || null,
      manufacturer: result.Manufacturer || null,
      plantCountry: result.PlantCountry || null,
      plantState: result.PlantState || null,
      plantCity: result.PlantCity || null,
      errorCode: result.ErrorCode || null,
      errorText: result.ErrorText || null,
      // More detailed data for advanced queries
      series: result.Series || null,
      trim: result.Trim || null,
      doors: result.Doors ? parseInt(result.Doors, 10) : null,
      grossVehicleWeight: result.GVWR || null,
      note: result.Note || null,
      basePrice: result.BasePrice || null,
      steeringLocation: result.SteeringLocation || null
    };

    console.log(`NHTSA vPIC API response parsed for VIN ${vin}`);

    // Store in cache
    const { error: insertError } = await supabaseClient
      .from('vpic_cache')
      .upsert({
        vin,
        vpic_data: data,
        fetched_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting into cache:', insertError);
    }

    // Return the data
    return new Response(
      JSON.stringify({ 
        data,
        source: 'api',
        fetched_at: new Date().toISOString()
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
    
  } catch (error) {
    console.error('Error in NHTSA vPIC function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});
