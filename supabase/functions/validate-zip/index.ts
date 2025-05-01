
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ZipValidationResponse {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: Array<{
    'place name': string;
    state: string;
    'state abbreviation': string;
    latitude: string;
    longitude: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { zip } = await req.json();
    
    // Basic validation
    if (!zip || typeof zip !== 'string' || !/^\d{5}$/.test(zip)) {
      return new Response(
        JSON.stringify({ error: 'Invalid ZIP code format', isValid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Check cache first
    const { data: cachedZip } = await supabase
      .from('zip_validations')
      .select('*')
      .eq('zip', zip)
      .maybeSingle();
    
    if (cachedZip) {
      return new Response(
        JSON.stringify({
          isValid: true,
          city: cachedZip.city,
          state: cachedZip.state,
          latitude: cachedZip.latitude,
          longitude: cachedZip.longitude
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Call Zippopotam.us API to validate the ZIP code
    const apiResponse = await fetch(`https://api.zippopotam.us/us/${zip}`);
    
    if (apiResponse.status === 404) {
      return new Response(
        JSON.stringify({ error: 'ZIP code not found', isValid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!apiResponse.ok) {
      console.error(`API Error: ${apiResponse.status} ${apiResponse.statusText}`);
      return new Response(
        JSON.stringify({ error: 'Error validating ZIP code', isValid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Parse API response
    const data: ZipValidationResponse = await apiResponse.json();
    
    if (!data.places || data.places.length === 0) {
      return new Response(
        JSON.stringify({ error: 'ZIP code has no associated places', isValid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const place = data.places[0];
    const result = {
      isValid: true,
      zip: data['post code'],
      city: place['place name'],
      state: place['state abbreviation'],
      latitude: place.latitude,
      longitude: place.longitude
    };
    
    // Store in cache
    await supabase.from('zip_validations').insert({
      zip: data['post code'],
      city: place['place name'],
      state: place['state abbreviation'],
      latitude: place.latitude,
      longitude: place.longitude,
      valid_at: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', isValid: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
