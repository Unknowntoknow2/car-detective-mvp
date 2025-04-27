
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

    if (makesError) {
      console.error('Error fetching makes:', makesError);
      throw makesError;
    }

    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('*')
      .order('model_name');

    if (modelsError) {
      console.error('Error fetching models:', modelsError);
      throw modelsError;
    }

    console.log(`Exporting ${makes.length} makes and ${models.length} models`);

    // Convert makes to CSV
    const makesRows = [
      ['id', 'make_name', 'logo_url', 'nhtsa_make_id', 'country_of_origin', 'created_at', 'updated_at'],
      ...makes.map(m => [
        m.id,
        m.make_name,
        m.logo_url || '',
        m.nhtsa_make_id?.toString() || '',
        m.country_of_origin || '',
        m.created_at || '',
        m.updated_at || ''
      ])
    ];
    const makesCsv = makesRows.map(row => row.join(',')).join('\n');

    // Convert models to CSV
    const modelsRows = [
      ['id', 'make_id', 'model_name', 'nhtsa_model_id', 'created_at', 'updated_at'],
      ...models.map(m => [
        m.id,
        m.make_id,
        m.model_name,
        m.nhtsa_model_id?.toString() || '',
        m.created_at || '',
        m.updated_at || ''
      ])
    ];
    const modelsCsv = modelsRows.map(row => row.join(',')).join('\n');

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
