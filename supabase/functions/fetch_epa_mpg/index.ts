
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
    const { year, make, model } = await req.json();
    
    // Validate input
    if (!year || !make || !model) {
      return new Response(
        JSON.stringify({ error: 'Year, make, and model are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first
    const { data: cachedData, error: cacheError } = await supabase
      .from('epa_mpg_cache')
      .select('mpg_data, fetched_at')
      .eq('year', year)
      .eq('make', make)
      .eq('model', model)
      .single();

    // If we have fresh cache data (less than 30 days old), return it
    if (cachedData && !cacheError) {
      const cachedAt = new Date(cachedData.fetched_at);
      const now = new Date();
      const cacheAge = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60 * 24); // days
      
      if (cacheAge < 30) {
        console.log(`Returning cached EPA MPG data for ${year} ${make} ${model}`);
        return new Response(
          JSON.stringify({ data: cachedData.mpg_data, source: 'cache' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fetch from EPA API
    console.log(`Fetching fresh EPA MPG data for ${year} ${make} ${model}`);
    const encodedMake = encodeURIComponent(make);
    const encodedModel = encodeURIComponent(model);
    const url = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${encodedMake}&model=${encodedModel}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CarDetective/1.0 (+https://cardetective.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`EPA API returned ${response.status}: ${response.statusText}`);
    }

    const mpgData = await response.json();
    
    // Upsert the data into our cache
    const { error: upsertError } = await supabase
      .from('epa_mpg_cache')
      .upsert({
        year,
        make,
        model,
        mpg_data: mpgData,
        fetched_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error('Error upserting to cache:', upsertError);
    }

    return new Response(
      JSON.stringify({ data: mpgData, source: 'api' }),
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
