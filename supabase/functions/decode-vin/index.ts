
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
    
    console.log('Starting VIN decode process for:', vin);

    // Call NHTSA API
    const nhtsaResponse = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
    const nhtsaData = await nhtsaResponse.json();

    console.log('Received response from NHTSA API');

    // Extract relevant data from NHTSA response
    const results = nhtsaData.Results;
    const vehicleInfo = {
      vin,
      make: results.find(r => r.Variable === 'Make')?.Value || null,
      model: results.find(r => r.Variable === 'Model')?.Value || null,
      year: parseInt(results.find(r => r.Variable === 'Model Year')?.Value) || null,
      trim: results.find(r => r.Variable === 'Trim')?.Value || null,
      engine: results.find(r => r.Variable === 'Engine Model')?.Value || null,
      transmission: results.find(r => r.Variable === 'Transmission Style')?.Value || null,
      drivetrain: results.find(r => r.Variable === 'Drive Type')?.Value || null,
      bodyType: results.find(r => r.Variable === 'Body Class')?.Value || null,
      timestamp: new Date().toISOString()
    };

    console.log('Processed vehicle info:', vehicleInfo);

    // Initialize Supabase client
    const supabaseClient = createClient(
      'https://xltxqqzattxogxtqrggt.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY'
    );

    // Try to insert the data
    const { data: insertedData, error: insertError } = await supabaseClient
      .from('decoded_vehicles')
      .upsert([vehicleInfo], {
        onConflict: 'vin',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing VIN data:', insertError);
      throw new Error(`Failed to store VIN data: ${insertError.message}`);
    }

    console.log('Successfully stored vehicle info in database');

    return new Response(JSON.stringify(vehicleInfo), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in decode-vin function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
