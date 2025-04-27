
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch makes and models from database
    const { data: makes, error: makesError } = await supabase
      .from('makes')
      .select('*')
      .order('make_name');

    if (makesError) throw makesError;

    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('*')
      .order('model_name');

    if (modelsError) throw modelsError;

    // Convert makes to CSV
    const makesRows = [
      ['make_name', 'logo_url', 'nhtsa_make_id', 'country_of_origin'],
      ...makes.map(m => [
        m.make_name,
        m.logo_url || '',
        m.nhtsa_make_id?.toString() || '',
        m.country_of_origin || ''
      ])
    ];
    const makesCsv = makesRows.map(row => row.join(',')).join('\n');

    // Convert models to CSV
    const modelsRows = [
      ['make_id', 'model_name', 'nhtsa_model_id'],
      ...models.map(m => [
        m.make_id,
        m.model_name,
        m.nhtsa_model_id?.toString() || ''
      ])
    ];
    const modelsCsv = modelsRows.map(row => row.join(',')).join('\n');

    // Return the data URLs
    const makesBlob = new Blob([makesCsv], { type: 'text/csv' });
    const modelsBlob = new Blob([modelsCsv], { type: 'text/csv' });

    return new Response(
      JSON.stringify({
        makes: makesCsv,
        models: modelsCsv,
        makesCount: makes.length,
        modelsCount: models.length
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in export function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
