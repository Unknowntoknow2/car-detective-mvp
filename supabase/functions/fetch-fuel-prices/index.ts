import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// EIA API configuration - ZIP to State mapping and series IDs for different fuel types
const EIA_API_KEY = Deno.env.get('EIA_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Regional mapping for major metropolitan areas - EIA series IDs
const REGION_FUEL_MAPPING = {
  // California - West Coast
  'CA': {
    gasoline: 'PET.EMM_EPMRU_PTE_SCA_DPG.W',
    diesel: 'PET.EMM_EPMRD_PTE_SCA_DPG.W'
  },
  // Texas - Gulf Coast  
  'TX': {
    gasoline: 'PET.EMM_EPMRU_PTE_STX_DPG.W', 
    diesel: 'PET.EMM_EPMRD_PTE_STX_DPG.W'
  },
  // New York - East Coast
  'NY': {
    gasoline: 'PET.EMM_EPMRU_PTE_MNY_DPG.W',
    diesel: 'PET.EMM_EPMRD_PTE_MNY_DPG.W'
  },
  // Florida - Lower Atlantic
  'FL': {
    gasoline: 'PET.EMM_EPMRU_PTE_SFL_DPG.W',
    diesel: 'PET.EMM_EPMRD_PTE_SFL_DPG.W'
  },
  // Illinois - Midwest
  'IL': {
    gasoline: 'PET.EMM_EPMRU_PTE_MIL_DPG.W',
    diesel: 'PET.EMM_EPMRD_PTE_MIL_DPG.W'
  },
  // National Average as fallback
  'US': {
    gasoline: 'PET.EMM_EPMRU_PTE_NUS_DPG.W',
    diesel: 'PET.EMM_EPMRD_PTE_NUS_DPG.W'
  }
};

// ZIP code to state/area mapping for major metropolitan areas
const ZIP_TO_AREA_MAP: Record<string, string> = {
  // California major metros
  '9': 'CA', // 90000-99999
  '8': 'CA', // 80000-89999 (some CA)
  
  // Texas major metros  
  '7': 'TX', // 70000-79999
  
  // New York metro
  '1': 'NY', // 10000-19999
  
  // Florida
  '3': 'FL', // 30000-39999
  
  // Illinois
  '6': 'IL', // 60000-69999
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting fuel price fetch from EIA API...');
    
    if (!EIA_API_KEY) {
      throw new Error('EIA_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const fuelPriceEntries: Array<{
      area_name: string;
      product_name: string;
      price: number;
      period: string;
    }> = [];

    let totalRequestsSuccessful = 0;
    let totalRequestsFailed = 0;

    // Fetch fuel prices for each region and fuel type
    for (const [areaCode, fuels] of Object.entries(REGION_FUEL_MAPPING)) {
      for (const [fuelType, seriesId] of Object.entries(fuels)) {
        try {
          console.log(`📊 Fetching ${fuelType} prices for ${areaCode}...`);
          
          const response = await fetch(
            `https://api.eia.gov/series/?api_key=${EIA_API_KEY}&series_id=${seriesId}&num=1`,
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json'
              }
            }
          );

          if (!response.ok) {
            console.error(`❌ EIA API error for ${areaCode}-${fuelType}: ${response.status}`);
            totalRequestsFailed++;
            continue;
          }

          const data = await response.json();
          const series = data.series?.[0];
          
          if (!series || !series.data || series.data.length === 0) {
            console.warn(`⚠️ No data available for ${areaCode}-${fuelType}`);
            totalRequestsFailed++;
            continue;
          }

          const latestEntry = series.data[0];
          const [period, priceValue] = latestEntry;
          const price = parseFloat(priceValue);

          if (isNaN(price) || price <= 0) {
            console.warn(`⚠️ Invalid price data for ${areaCode}-${fuelType}: ${priceValue}`);
            totalRequestsFailed++;
            continue;
          }

          // Map area codes to readable names
          const areaName = areaCode === 'US' ? 'United States' : 
                          areaCode === 'CA' ? 'California' :
                          areaCode === 'TX' ? 'Texas' :
                          areaCode === 'NY' ? 'New York' :
                          areaCode === 'FL' ? 'Florida' :
                          areaCode === 'IL' ? 'Illinois' : areaCode;

          // Map fuel types to product names
          const productName = fuelType === 'gasoline' ? 'Regular Gasoline' :
                             fuelType === 'diesel' ? 'Diesel Fuel' : fuelType;

          fuelPriceEntries.push({
            area_name: areaName,
            product_name: productName, 
            price: price,
            period: period
          });

          totalRequestsSuccessful++;
          console.log(`✅ ${areaName} ${productName}: $${price.toFixed(3)}/gal (${period})`);

        } catch (error) {
          console.error(`❌ Error fetching ${areaCode}-${fuelType}:`, error);
          totalRequestsFailed++;
        }
      }
    }

    if (fuelPriceEntries.length === 0) {
      throw new Error('No fuel price data could be retrieved from EIA API');
    }

    console.log(`📈 Successfully retrieved ${fuelPriceEntries.length} fuel price entries`);

    // Clear existing data and insert new prices
    console.log('🔄 Updating regional_fuel_costs table...');
    
    // Delete old entries (keep data fresh)
    const { error: deleteError } = await supabase
      .from('regional_fuel_costs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (deleteError) {
      console.error('⚠️ Error clearing old fuel costs:', deleteError);
    }

    // Insert new fuel price data
    const { data: insertData, error: insertError } = await supabase
      .from('regional_fuel_costs')
      .insert(fuelPriceEntries);

    if (insertError) {
      throw new Error(`Failed to insert fuel prices: ${insertError.message}`);
    }

    const summary = {
      timestamp: new Date().toISOString(),
      entries_inserted: fuelPriceEntries.length,
      successful_requests: totalRequestsSuccessful,
      failed_requests: totalRequestsFailed,
      success_rate: `${Math.round((totalRequestsSuccessful / (totalRequestsSuccessful + totalRequestsFailed)) * 100)}%`,
      sample_prices: fuelPriceEntries.slice(0, 3).map(entry => 
        `${entry.area_name} ${entry.product_name}: $${entry.price.toFixed(3)}/gal`
      )
    };

    console.log('🚀 Fuel price update completed successfully:', summary);

    return new Response(JSON.stringify({
      success: true,
      message: 'Fuel prices updated successfully',
      summary
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Fuel price fetch failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
