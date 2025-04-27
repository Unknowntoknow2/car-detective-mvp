
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log("Fetching makes from NHTSA API...");
    const makesRes = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json');
    
    if (!makesRes.ok) {
      throw new Error(`NHTSA API returned status ${makesRes.status}`);
    }
    
    const makesData = await makesRes.json();
    const makes = makesData.Results || [];

    let importedMakes = 0;
    let importedModels = 0;

    // Process makes in batches
    for (const make of makes) {
      try {
        const makeName = make.Make_Name.trim();

        // Insert make with a generated UUID
        const { data: insertedMake, error: makeError } = await supabase
          .from('makes')
          .upsert({
            make_name: makeName,
            nhtsa_make_id: make.Make_ID,
          })
          .select()
          .single();

        if (makeError) {
          console.error(`Error inserting make ${makeName}:`, makeError);
          continue;
        }

        importedMakes++;

        // Fetch models for this make
        console.log(`Fetching models for ${makeName}...`);
        const modelsRes = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/${make.Make_ID}?format=json`
        );
        
        if (!modelsRes.ok) {
          console.error(`Failed to fetch models for make ${makeName}: status ${modelsRes.status}`);
          continue;
        }
        
        const modelsData = await modelsRes.json();
        const models = modelsData.Results || [];

        // Insert models
        for (const model of models) {
          try {
            const modelName = model.Model_Name.trim();
            
            const { error: modelError } = await supabase
              .from('models')
              .upsert({
                make_id: insertedMake.id,
                model_name: modelName,
                nhtsa_model_id: model.Model_ID
              }, {
                onConflict: 'make_id,model_name'
              });

            if (modelError) {
              console.error(`Error inserting model ${modelName}:`, modelError);
              continue;
            }

            importedModels++;
          } catch (modelErr) {
            console.error(`Error processing model ${model.Model_Name}:`, modelErr);
          }
        }
      } catch (makeErr) {
        console.error(`Error processing make ${make.Make_Name}:`, makeErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        makeCount: importedMakes,
        modelCount: importedModels,
        message: `Successfully imported ${importedMakes} makes and ${importedModels} models`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in import function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
