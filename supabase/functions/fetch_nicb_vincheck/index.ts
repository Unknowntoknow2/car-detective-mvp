
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("NICB VINCheck function loaded");

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

    console.log(`Checking NICB VINCheck for VIN: ${vin}`);

    // First check if we have a cached entry for this VIN
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check the cache
    const { data: cachedData, error: cacheError } = await supabaseClient
      .from('vin_cache')
      .select('nicb_data, fetched_at')
      .eq('vin', vin)
      .single();

    // If we have cache data and it's less than 7 days old, return it
    if (cachedData && !cacheError) {
      const fetchedAt = new Date(cachedData.fetched_at);
      const now = new Date();
      const cacheAge = now.getTime() - fetchedAt.getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

      if (cacheAge < sevenDaysInMs) {
        console.log(`Returning cached NICB data for VIN ${vin}`);
        return new Response(
          JSON.stringify({ 
            data: cachedData.nicb_data,
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

    // Fetch from NICB VINCheck API
    const url = `https://mobileapi.nicb.org/vincheck/vehicles/${vin}`;
    console.log(`Fetching from NICB API: ${url}`);

    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`NICB API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          error: response.status === 404 
            ? 'No NICB data found for this VIN.' 
            : `NICB API error: ${response.status} ${response.statusText}`
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
    const data = await response.json();
    console.log(`NICB API response for VIN ${vin}:`, data);

    // Store in cache
    const { error: insertError } = await supabaseClient
      .from('vin_cache')
      .upsert({
        vin,
        nicb_data: data,
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
    console.error('Error in NICB VINCheck function:', error);
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
