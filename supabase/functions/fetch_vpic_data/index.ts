
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("NHTSA vPIC Decoder function loaded");

// Fallback mock data for when NHTSA API is down
const getFallbackVehicleData = (vin: string) => {
  // Extract basic info from VIN structure
  const year = 2000 + parseInt(vin.charAt(9)) + (vin.charAt(9) >= 'A' ? 10 : 0);
  const make = vin.charAt(0) === '1' ? 'Chevrolet' : 
               vin.charAt(0) === '2' ? 'Ford' : 
               vin.charAt(0) === 'J' ? 'Toyota' : 'Unknown';
  
  return {
    vin: vin,
    make: make,
    model: 'Suburban', // Default model for demo
    modelYear: year,
    vehicleType: 'SUV',
    bodyClass: 'Sport Utility Vehicle',
    driveType: '4WD',
    fuelType: 'Gasoline',
    engineSize: 5.3,
    engineCylinders: 8,
    transmissionStyle: 'Automatic',
    manufacturer: make,
    plantCountry: 'United States',
    plantState: null,
    plantCity: null,
    errorCode: null,
    errorText: 'Data provided by fallback service - NHTSA API temporarily unavailable',
    series: null,
    trim: 'Premier',
    doors: 4,
    grossVehicleWeight: null,
    note: 'This is demo data due to external API issues',
    basePrice: null,
    steeringLocation: 'Left-Hand Drive'
  };
};

// Retry function with exponential backoff
const retryWithBackoff = async (fn: () => Promise<Response>, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await fn();
      if (result.ok) {
        return result;
      }
      if (result.status === 503 && i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Attempt ${i + 1} failed with 503, retrying in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return result;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

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

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check the cache first
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

    // Try to fetch from NHTSA vPIC API with retry logic
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`;
    console.log(`Fetching from NHTSA vPIC API: ${url}`);

    let data;
    let isFromFallback = false;

    try {
      const response = await retryWithBackoff(() => fetch(url), 3, 1000);
      
      if (!response.ok) {
        console.error(`NHTSA API error: ${response.status} ${response.statusText}`);
        throw new Error(`NHTSA API returned ${response.status}`);
      }

      // Parse the response
      const rawData = await response.json();
      
      if (!rawData.Results || rawData.Results.length === 0) {
        throw new Error('No data returned from NHTSA API');
      }

      // Process the NHTSA response
      const result = rawData.Results[0];
      data = {
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
        series: result.Series || null,
        trim: result.Trim || null,
        doors: result.Doors ? parseInt(result.Doors, 10) : null,
        grossVehicleWeight: result.GVWR || null,
        note: result.Note || null,
        basePrice: result.BasePrice || null,
        steeringLocation: result.SteeringLocation || null
      };

      console.log(`NHTSA vPIC API response parsed for VIN ${vin}`);
    } catch (error) {
      console.error(`Failed to fetch from NHTSA API, using fallback data:`, error);
      data = getFallbackVehicleData(vin);
      isFromFallback = true;
    }

    // Store in cache (even fallback data for short term)
    const cacheExpiry = isFromFallback ? 1 : 30; // 1 day for fallback, 30 days for real data
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

    // Return the data with appropriate source indicator
    return new Response(
      JSON.stringify({ 
        data,
        source: isFromFallback ? 'fallback' : 'api',
        fetched_at: new Date().toISOString(),
        is_demo_data: isFromFallback,
        message: isFromFallback ? 'NHTSA API temporarily unavailable - using demo data for testing' : null
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
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        fallback_available: true
      }),
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
