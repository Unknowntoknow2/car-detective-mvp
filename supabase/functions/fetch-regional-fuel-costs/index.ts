import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    console.log('Starting EIA fuel data fetch...');
    
    const eiaApiKey = Deno.env.get('EIA_API_KEY');
    if (!eiaApiKey) {
      throw new Error('EIA_API_KEY not configured');
    }

    // Fetch latest fuel prices from EIA
    const url = `https://api.eia.gov/v2/petroleum/pri/gnd/data/?frequency=weekly&data[0]=value&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000&api_key=${eiaApiKey}`;
    
    console.log('Fetching from EIA API...');
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`EIA API request failed: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const rows = json?.response?.data || [];
    console.log(`Received ${rows.length} records from EIA`);

    if (rows.length === 0) {
      throw new Error('No data received from EIA API');
    }

    // Parse and filter the data
    const parsed = rows
      .filter((entry: any) => 
        entry["area-name"] && 
        entry["product-name"] && 
        entry["value"] !== null &&
        entry["period"]
      )
      .map((entry: any) => ({
        area_name: entry["area-name"],
        product_name: entry["product-name"],
        price: parseFloat(entry["value"]),
        period: entry["period"],
      }))
      .filter((entry: any) => !isNaN(entry.price));

    console.log(`Parsed ${parsed.length} valid records`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Clear old data (keep only latest week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { error: deleteError } = await supabase
      .from('regional_fuel_costs')
      .delete()
      .lt('period', oneWeekAgo.toISOString().split('T')[0]);

    if (deleteError) {
      console.warn('Warning: Could not clean old fuel data:', deleteError);
    }

    // Insert new data in batches
    const batchSize = 1000;
    let insertedCount = 0;
    
    for (let i = 0; i < parsed.length; i += batchSize) {
      const batch = parsed.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('regional_fuel_costs')
        .upsert(batch, {
          onConflict: 'area_name,product_name,period',
          ignoreDuplicates: false
        });

      if (insertError) {
        console.error(`Error inserting batch ${i}-${i + batch.length}:`, insertError);
        throw insertError;
      }
      
      insertedCount += batch.length;
      console.log(`Inserted batch: ${insertedCount}/${parsed.length}`);
    }

    console.log(`Successfully updated ${insertedCount} fuel cost records`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${insertedCount} fuel cost records`,
        data: parsed.slice(0, 10) // Return sample of data
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in fetch-regional-fuel-costs:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.stack 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
