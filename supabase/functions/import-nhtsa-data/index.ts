
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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
    console.log(`NHTSA returned ${makes.length} makes`);

    let importedMakes = 0;
    let updatedMakes = 0;
    let errors = 0;

    // Process makes in batches
    for (const make of makes) {
      try {
        const makeName = make.Make_Name.trim();

        // Check if the make already exists
        const { data: existingMake, error: checkError } = await supabase
          .from('makes')
          .select('id, nhtsa_make_id')
          .eq('make_name', makeName)
          .maybeSingle();

        if (checkError) {
          console.error(`Error checking make ${makeName}:`, checkError);
          errors++;
          continue;
        }

        if (existingMake) {
          // Update existing make with NHTSA ID if needed
          if (existingMake.nhtsa_make_id !== make.Make_ID) {
            const { error: updateError } = await supabase
              .from('makes')
              .update({ nhtsa_make_id: make.Make_ID })
              .eq('id', existingMake.id);

            if (updateError) {
              console.error(`Error updating make ${makeName}:`, updateError);
              errors++;
            } else {
              updatedMakes++;
              console.log(`Updated make: ${makeName} with NHTSA ID: ${make.Make_ID}`);
            }
          }
        } else {
          // Insert new make
          const { data: insertedMake, error: makeError } = await supabase
            .from('makes')
            .upsert({
              make_name: makeName,
              nhtsa_make_id: make.Make_ID,
              logo_url: null  // You can add logo URL fetching logic later
            })
            .select()
            .single();

          if (makeError) {
            console.error(`Error inserting make ${makeName}:`, makeError);
            errors++;
          } else {
            importedMakes++;
            console.log(`Imported make: ${makeName} with NHTSA ID: ${make.Make_ID}`);
          }
        }
      } catch (makeErr) {
        console.error(`Error processing make ${make.Make_Name}:`, makeErr);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        makeCount: importedMakes,
        updatedCount: updatedMakes,
        errorCount: errors,
        message: `Successfully imported ${importedMakes} new makes and updated ${updatedMakes} existing makes.`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in import function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
