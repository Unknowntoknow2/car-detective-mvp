
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0"
import { getFallbackMakes, getFallbackModels } from "../../../src/utils/vehicle/fallbackData.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const makes = getFallbackMakes();
    console.log(`Importing ${makes.length} makes`);

    // Upsert makes
    const { error: makesError } = await supabase
      .from('makes')
      .upsert(makes.map(make => ({
        id: make.id,
        make_name: make.make_name,
        logo_url: make.logo_url,
        nhtsa_make_id: make.nhtsa_make_id,
        country_of_origin: make.country_of_origin,
        description: make.description,
        founding_year: make.founding_year
      })), { onConflict: 'id' });

    if (makesError) throw makesError;

    // Import models
    let totalModels = 0;
    for (const make of makes) {
      const models = getFallbackModels(make.id);
      totalModels += models.length;
      
      const { error: modelsError } = await supabase
        .from('models')
        .upsert(models.map(model => ({
          id: model.id,
          make_id: model.make_id,
          model_name: model.model_name,
          nhtsa_model_id: model.nhtsa_model_id
        })), { onConflict: 'id' });

      if (modelsError) throw modelsError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        makeCount: makes.length, 
        modelCount: totalModels 
      }), 
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Vehicle data import error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});
