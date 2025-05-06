
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Top 50 ZIP codes with market data
const marketData = [
  { zip_code: '90210', market_multiplier: 5.0 },   // Beverly Hills
  { zip_code: '10001', market_multiplier: 4.5 },   // New York
  { zip_code: '94016', market_multiplier: 4.2 },   // San Francisco
  { zip_code: '20001', market_multiplier: 3.8 },   // Washington DC
  { zip_code: '60601', market_multiplier: 3.5 },   // Chicago
  { zip_code: '02108', market_multiplier: 3.3 },   // Boston
  { zip_code: '98101', market_multiplier: 3.0 },   // Seattle
  { zip_code: '78701', market_multiplier: 2.8 },   // Austin
  { zip_code: '33139', market_multiplier: 2.5 },   // Miami Beach
  { zip_code: '80202', market_multiplier: 2.3 },   // Denver
  { zip_code: '85001', market_multiplier: 2.0 },   // Phoenix
  { zip_code: '89101', market_multiplier: 1.8 },   // Las Vegas
  { zip_code: '97201', market_multiplier: 1.5 },   // Portland
  { zip_code: '75201', market_multiplier: 1.3 },   // Dallas
  { zip_code: '37201', market_multiplier: 1.0 },   // Nashville
  { zip_code: '27601', market_multiplier: 0.8 },   // Raleigh
  { zip_code: '30301', market_multiplier: 0.5 },   // Atlanta
  { zip_code: '55401', market_multiplier: 0.3 },   // Minneapolis
  { zip_code: '53202', market_multiplier: 0.0 },   // Milwaukee
  { zip_code: '32801', market_multiplier: -0.2 },  // Orlando
  { zip_code: '64101', market_multiplier: -0.5 },  // Kansas City
  { zip_code: '40202', market_multiplier: -0.8 },  // Louisville
  { zip_code: '73101', market_multiplier: -1.0 },  // Oklahoma City
  { zip_code: '48201', market_multiplier: -1.2 },  // Detroit
  { zip_code: '15222', market_multiplier: -1.5 },  // Pittsburgh
  { zip_code: '45202', market_multiplier: -1.8 },  // Cincinnati
  { zip_code: '43215', market_multiplier: -2.0 },  // Columbus
  { zip_code: '44101', market_multiplier: -2.2 },  // Cleveland
  { zip_code: '19102', market_multiplier: -2.5 },  // Philadelphia
  { zip_code: '46204', market_multiplier: -2.8 },  // Indianapolis
  { zip_code: '63101', market_multiplier: -3.0 },  // St. Louis
  { zip_code: '35203', market_multiplier: -3.2 },  // Birmingham
  { zip_code: '38103', market_multiplier: -3.5 },  // Memphis
  { zip_code: '76102', market_multiplier: -3.8 },  // Fort Worth
  { zip_code: '70112', market_multiplier: -4.0 },  // New Orleans
  { zip_code: '77002', market_multiplier: -4.2 },  // Houston
  { zip_code: '29401', market_multiplier: -4.5 },  // Charleston
  { zip_code: '72201', market_multiplier: -4.8 },  // Little Rock
  { zip_code: '50309', market_multiplier: -5.0 },  // Des Moines
  { zip_code: '83702', market_multiplier: -5.2 },  // Boise
  { zip_code: '59601', market_multiplier: -5.5 },  // Helena
  { zip_code: '82001', market_multiplier: -5.8 },  // Cheyenne
  { zip_code: '87501', market_multiplier: -6.0 },  // Santa Fe
  { zip_code: '84101', market_multiplier: -6.2 },  // Salt Lake City
  { zip_code: '58501', market_multiplier: -6.5 },  // Bismarck
  { zip_code: '57501', market_multiplier: -6.8 },  // Pierre
  { zip_code: '68502', market_multiplier: -7.0 },  // Lincoln
  { zip_code: '66603', market_multiplier: -7.2 },  // Topeka
  { zip_code: '80524', market_multiplier: -7.5 },  // Fort Collins
  { zip_code: '93301', market_multiplier: -7.8 }   // Bakersfield
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if table is empty
    const { count, error: countError } = await supabase
      .from('market_adjustments')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(`Error checking market_adjustments: ${countError.message}`);
    }

    // If we already have data, just return success
    if (count && count > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Data already exists. Table has ${count} records.` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert market data
    const { error: insertError } = await supabase
      .from('market_adjustments')
      .insert(marketData);

    if (insertError) {
      throw new Error(`Error inserting data: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully populated ${marketData.length} ZIP codes with market data.` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in populate-market-data function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
