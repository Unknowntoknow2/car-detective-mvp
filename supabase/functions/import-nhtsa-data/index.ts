
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

    let importedMakes = 0;

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
            logo_url: null  // You can add logo URL fetching logic later
          })
          .select()
          .single();

        if (makeError) {
          console.error(`Error inserting make ${makeName}:`, makeError);
          continue;
        }

        importedMakes++;
      } catch (makeErr) {
        console.error(`Error processing make ${make.Make_Name}:`, makeErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        makeCount: importedMakes,
        message: `Successfully imported ${importedMakes} makes`
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
