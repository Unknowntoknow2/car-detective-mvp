
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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
    const { vin } = await req.json();
    
    console.log('Decoding VIN:', vin);

    // Call NHTSA API
    const nhtsaResponse = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
    const nhtsaData = await nhtsaResponse.json();

    // Extract relevant data from NHTSA response
    const results = nhtsaData.Results;
    const vehicleInfo = {
      vin,
      make: results.find(r => r.Variable === 'Make')?.Value,
      model: results.find(r => r.Variable === 'Model')?.Value,
      year: parseInt(results.find(r => r.Variable === 'Model Year')?.Value),
      trim: results.find(r => r.Variable === 'Trim')?.Value,
      engine: results.find(r => r.Variable === 'Engine Model')?.Value,
      transmission: results.find(r => r.Variable === 'Transmission Style')?.Value,
      drivetrain: results.find(r => r.Variable === 'Drive Type')?.Value,
      bodyType: results.find(r => r.Variable === 'Body Class')?.Value,
    };

    // Store the result in Supabase
    const supabaseClient = createClient(
      'https://xltxqqzattxogxtqrggt.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY'
    );

    const { error: insertError } = await supabaseClient
      .from('decoded_vehicles')
      .upsert([vehicleInfo]);

    if (insertError) {
      console.error('Error storing VIN data:', insertError);
      throw new Error('Failed to store VIN data');
    }

    return new Response(JSON.stringify(vehicleInfo), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in decode-vin function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
