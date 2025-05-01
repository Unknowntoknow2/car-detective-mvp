
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
      .from('census_cache')
      .select('census_data, fetched_at')
      .eq('zip', zip)
      .single();

    // If we have fresh cache data (less than 365 days old), return it
    if (cachedData && !cacheError) {
      const cachedAt = new Date(cachedData.fetched_at);
      const now = new Date();
      const cacheAge = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60 * 24); // days
      
      if (cacheAge < 365) {
        console.log(`Returning cached Census data for ZIP ${zip}`);
        return new Response(
          JSON.stringify({ data: cachedData.census_data, source: 'cache' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get Census API key from environment
    const censusApiKey = Deno.env.get('CENSUS_API_KEY');
    if (!censusApiKey) {
      throw new Error('Census API key not configured');
    }

    // Fetch from Census API
    console.log(`Fetching fresh Census data for ZIP ${zip}`);
    // B01003_001E = Total Population
    // B19013_001E = Median Household Income in the Past 12 Months
    const url = `https://api.census.gov/data/2021/acs/acs5?get=B01003_001E,B19013_001E&for=zip%20code%20tabulation%20area:${zip}&key=${censusApiKey}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Census API returned ${response.status}: ${response.statusText}`);
    }

    const rawData = await response.json();
    
    // Transform the Census API response into a more usable format
    // Census API returns data as a 2D array with headers in the first row
    const headers = rawData[0];
    const values = rawData[1];
    
    const censusData = {
      population: parseInt(values[headers.indexOf("B01003_001E")]),
      medianIncome: parseInt(values[headers.indexOf("B19013_001E")]),
      zip: values[headers.indexOf("zip code tabulation area")]
    };
    
    // Upsert the data into our cache
    const { error: upsertError } = await supabase
      .from('census_cache')
      .upsert({
        zip,
        census_data: censusData,
        fetched_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error('Error upserting to cache:', upsertError);
    }

    return new Response(
      JSON.stringify({ data: censusData, source: 'api' }),
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
