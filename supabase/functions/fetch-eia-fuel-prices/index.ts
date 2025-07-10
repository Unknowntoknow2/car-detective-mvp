import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const EIA_API_KEY = Deno.env.get('EIA_API_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ZIP to state mapping for major markets
const ZIP_STATE_MAP: Record<string, string> = {
  // California
  '90210': 'CA', '90211': 'CA', '90401': 'CA', '94102': 'CA', '95821': 'CA',
  // Texas  
  '75201': 'TX', '77001': 'TX', '78701': 'TX', '77494': 'TX',
  // New York
  '10001': 'NY', '10002': 'NY', '11201': 'NY', '12180': 'NY',
  // Florida
  '33101': 'FL', '32301': 'FL', '33401': 'FL', '34102': 'FL',
  // Illinois
  '60601': 'IL', '60602': 'IL', '61801': 'IL', '62701': 'IL'
};

// EIA series mapping for regional fuel prices
const EIA_SERIES_MAP: Record<string, Record<string, string>> = {
  'CA': {
    'gasoline': 'PET.EMM_EPMRU_PTE_SCA_DPG.W',
    'diesel': 'PET.EMD_EPLLPA_PTE_SCA_DPG.W',
    'premium': 'PET.EMM_EPMRU_PTE_SCA_DPG.W' // Using regular for now
  },
  'TX': {
    'gasoline': 'PET.EMM_EPMRU_PTE_STX_DPG.W',
    'diesel': 'PET.EMD_EPLLPA_PTE_STX_DPG.W',
    'premium': 'PET.EMM_EPMRU_PTE_STX_DPG.W'
  },
  'NY': {
    'gasoline': 'PET.EMM_EPMRU_PTE_SNY_DPG.W',
    'diesel': 'PET.EMD_EPLLPA_PTE_SNY_DPG.W',
    'premium': 'PET.EMM_EPMRU_PTE_SNY_DPG.W'
  },
  'FL': {
    'gasoline': 'PET.EMM_EPMRU_PTE_SFL_DPG.W',
    'diesel': 'PET.EMD_EPLLPA_PTE_SFL_DPG.W',
    'premium': 'PET.EMM_EPMRU_PTE_SFL_DPG.W'
  },
  'IL': {
    'gasoline': 'PET.EMM_EPMRU_PTE_SIL_DPG.W',
    'diesel': 'PET.EMD_EPLLPA_PTE_SIL_DPG.W',
    'premium': 'PET.EMM_EPMRU_PTE_SIL_DPG.W'
  },
  'US': {
    'gasoline': 'PET.EMM_EPMRU_PTE_NUS_DPG.W',
    'diesel': 'PET.EMD_EPLLPA_PTE_NUS_DPG.W',
    'premium': 'PET.EMM_EPMRU_PTE_NUS_DPG.W'
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zip_code, fuel_type = 'gasoline' } = await req.json();
    
    if (!zip_code) {
      throw new Error('ZIP code is required');
    }

    console.log(`🔍 Fetching fuel price for ZIP: ${zip_code}, Fuel: ${fuel_type}`);

    // Determine state from ZIP code
    const state_code = ZIP_STATE_MAP[zip_code] || 'US'; // Default to US national
    
    // Get EIA series ID for this state and fuel type
    const seriesId = EIA_SERIES_MAP[state_code]?.[fuel_type];
    if (!seriesId) {
      throw new Error(`No EIA series found for state ${state_code} and fuel type ${fuel_type}`);
    }

    // Check if we have recent cached data (less than 7 days old)
    const { data: cachedData, error: cacheError } = await supabase
      .from('regional_fuel_costs')
      .select('*')
      .eq('zip_code', zip_code)
      .eq('fuel_type', fuel_type)
      .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (cachedData && !cacheError) {
      console.log(`✅ Using cached fuel price: $${cachedData.cost_per_gallon}/gal`);
      return new Response(
        JSON.stringify({
          success: true,
          zip_code,
          state_code,
          fuel_type,
          cost_per_gallon: cachedData.cost_per_gallon,
          source: 'cache',
          cached_at: cachedData.updated_at
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🌐 Fetching fresh data from EIA API for series: ${seriesId}`);

    // Fetch from EIA API
    const eiaUrl = `https://api.eia.gov/series/?api_key=${EIA_API_KEY}&series_id=${seriesId}`;
    const eiaResponse = await fetch(eiaUrl);
    
    if (!eiaResponse.ok) {
      throw new Error(`EIA API error: ${eiaResponse.status}`);
    }

    const eiaData = await eiaResponse.json();
    const latest = eiaData.series?.[0]?.data?.[0];
    
    if (!latest) {
      throw new Error('No price data available from EIA');
    }

    const [date, pricePerGallon] = latest;
    const costPerGallon = parseFloat(pricePerGallon);

    if (isNaN(costPerGallon) || costPerGallon <= 0) {
      throw new Error(`Invalid price data: ${pricePerGallon}`);
    }

    console.log(`💰 Fresh EIA price: $${costPerGallon}/gal for ${date}`);

    // Upsert into cache
    const { error: upsertError } = await supabase
      .from('regional_fuel_costs')
      .upsert({
        zip_code,
        state_code,
        fuel_type,
        cost_per_gallon: costPerGallon,
        source: 'eia.gov',
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'zip_code,fuel_type',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      console.error('❌ Cache upsert error:', upsertError);
      // Continue anyway - we have the price data
    } else {
      console.log('✅ Successfully cached fuel price data');
    }

    return new Response(
      JSON.stringify({
        success: true,
        zip_code,
        state_code,
        fuel_type,
        cost_per_gallon: costPerGallon,
        source: 'eia.gov',
        date,
        series_id: seriesId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Fuel price fetch error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        fallback_price: fuel_type === 'diesel' ? 4.25 : 3.85 // National averages
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});