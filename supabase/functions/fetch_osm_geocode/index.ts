
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zip } = await req.json();
    
    // Validate input
    if (!zip || !/^\d{5}$/.test(zip)) {
      return new Response(
        JSON.stringify({ error: 'Valid 5-digit ZIP code is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first
    const { data: cachedData, error: cacheError } = await supabase
      .from('osm_geocode_cache')
      .select('geocode_data, fetched_at')
      .eq('zip', zip)
      .single();

    // If we have fresh cache data (less than 90 days old), return it
    if (cachedData && !cacheError) {
      const cachedAt = new Date(cachedData.fetched_at);
      const now = new Date();
      const cacheAge = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60 * 24); // days
      
      if (cacheAge < 90) {
        console.log(`Returning cached OSM geocode data for ZIP ${zip}`);
        return new Response(
          JSON.stringify({ data: cachedData.geocode_data, source: 'cache' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fetch from OpenStreetMap Nominatim API
    console.log(`Fetching fresh OSM geocode data for ZIP ${zip}`);
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=us&format=json`;
    
    // Wait 1 second to respect Nominatim usage policy
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CarDetective/1.0 (+https://cardetective.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`OSM API returned ${response.status}: ${response.statusText}`);
    }

    const geocodeData = await response.json();
    
    // Upsert the data into our cache
    const { error: upsertError } = await supabase
      .from('osm_geocode_cache')
      .upsert({
        zip,
        geocode_data: geocodeData,
        fetched_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error('Error upserting to cache:', upsertError);
    }

    return new Response(
      JSON.stringify({ data: geocodeData, source: 'api' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
