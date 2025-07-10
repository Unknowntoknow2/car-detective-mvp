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

// Comprehensive ZIP to state mapping for better regional coverage
const ZIP_STATE_MAP: Record<string, string> = {
  // California (900-961)
  '90210': 'CA', '90211': 'CA', '90401': 'CA', '94102': 'CA', '95821': 'CA', '90001': 'CA', '91911': 'CA', '92101': 'CA', '93101': 'CA', '94301': 'CA', '95014': 'CA', '96001': 'CA',
  // Texas (730-799, 885)  
  '75201': 'TX', '77001': 'TX', '78701': 'TX', '77494': 'TX', '73301': 'TX', '79901': 'TX', '88501': 'TX',
  // New York (100-149)
  '10001': 'NY', '10002': 'NY', '11201': 'NY', '12180': 'NY', '13201': 'NY', '14201': 'NY',
  // Florida (320-349)
  '33101': 'FL', '32301': 'FL', '33401': 'FL', '34102': 'FL', '32801': 'FL',
  // Illinois (600-629)
  '60601': 'IL', '60602': 'IL', '61801': 'IL', '62701': 'IL',
  // Pennsylvania (150-196)
  '15201': 'PA', '16001': 'PA', '17101': 'PA', '18001': 'PA', '19101': 'PA',
  // Ohio (430-458)
  '43215': 'OH', '44101': 'OH', '45201': 'OH',
  // Georgia (300-319, 398-399)
  '30309': 'GA', '31401': 'GA', '39901': 'GA',
  // North Carolina (270-289)
  '27514': 'NC', '28001': 'NC',
  // Michigan (480-499)
  '48201': 'MI', '49001': 'MI',
  // New Jersey (070-089)
  '07001': 'NJ', '08001': 'NJ',
  // Virginia (220-246)
  '22030': 'VA', '23451': 'VA',
  // Washington (980-994)
  '98101': 'WA', '99201': 'WA',
  // Arizona (850-865)
  '85001': 'AZ', '86001': 'AZ', 
  // Massachusetts (010-027)
  '02101': 'MA', '01201': 'MA',
  // Tennessee (370-385)
  '37201': 'TN', '38101': 'TN',
  // Indiana (460-479)
  '46201': 'IN', '47901': 'IN',
  // Missouri (630-658)
  '63101': 'MO', '64111': 'MO',
  // Wisconsin (530-549)
  '53201': 'WI', '54901': 'WI',
  // Minnesota (550-567)
  '55101': 'MN', '56601': 'MN',
  // Colorado (800-816)
  '80201': 'CO', '81601': 'CO',
  // Alabama (350-369)
  '35201': 'AL', '36801': 'AL',
  // Louisiana (700-714)
  '70112': 'LA', '71201': 'LA',
  // Kentucky (400-427)
  '40202': 'KY', '42101': 'KY',
  // South Carolina (290-299)
  '29201': 'SC', '29401': 'SC',
  // Oklahoma (730-731, 734-741)
  '73102': 'OK', '74101': 'OK',
  // Arkansas (716-729, 755-772)
  '72201': 'AR', '71601': 'AR',
  // Iowa (500-528)
  '50309': 'IA', '52801': 'IA',
  // Kansas (660-679)
  '66101': 'KS', '67201': 'KS',
  // Utah (840-847)
  '84101': 'UT', '84601': 'UT',
  // Nevada (890-898)
  '89101': 'NV', '89701': 'NV',
  // New Mexico (870-884)
  '87101': 'NM', '88001': 'NM',
  // Idaho (832-838)
  '83201': 'ID', '83701': 'ID',
  // West Virginia (247-268)
  '25301': 'WV', '26201': 'WV',
  // Nebraska (680-693)
  '68101': 'NE', '69001': 'NE',
  // Maine (039-049)
  '04101': 'ME', '04401': 'ME',
  // New Hampshire (030-038)
  '03101': 'NH', '03801': 'NH',
  // Vermont (050-059)
  '05401': 'VT', '05601': 'VT',
  // Rhode Island (028-029)
  '02801': 'RI', '02901': 'RI',
  // Connecticut (060-069)
  '06101': 'CT', '06801': 'CT',
  // Delaware (197-199)
  '19701': 'DE', '19801': 'DE',
  // Maryland (206-219)
  '20601': 'MD', '21201': 'MD',
  // District of Columbia (200-205)
  '20001': 'DC', '20500': 'DC'
};

// Function to map ZIP to state using prefix logic
function getStateFromZip(zipCode: string): string {
  // First try direct lookup
  if (ZIP_STATE_MAP[zipCode]) {
    return ZIP_STATE_MAP[zipCode];
  }
  
  // Use ZIP prefix mapping for broader coverage
  const zipPrefix = zipCode.substring(0, 3);
  const prefixNum = parseInt(zipPrefix);
  
  if (prefixNum >= 100 && prefixNum <= 149) return 'NY';
  if (prefixNum >= 150 && prefixNum <= 196) return 'PA';
  if (prefixNum >= 200 && prefixNum <= 205) return 'DC';
  if (prefixNum >= 206 && prefixNum <= 219) return 'MD';
  if (prefixNum >= 220 && prefixNum <= 246) return 'VA';
  if (prefixNum >= 247 && prefixNum <= 268) return 'WV';
  if (prefixNum >= 270 && prefixNum <= 289) return 'NC';
  if (prefixNum >= 290 && prefixNum <= 299) return 'SC';
  if (prefixNum >= 300 && prefixNum <= 319) return 'GA';
  if (prefixNum >= 320 && prefixNum <= 349) return 'FL';
  if (prefixNum >= 350 && prefixNum <= 369) return 'AL';
  if (prefixNum >= 370 && prefixNum <= 385) return 'TN';
  if (prefixNum >= 386 && prefixNum <= 399) return 'MS';
  if (prefixNum >= 400 && prefixNum <= 427) return 'KY';
  if (prefixNum >= 430 && prefixNum <= 458) return 'OH';
  if (prefixNum >= 460 && prefixNum <= 479) return 'IN';
  if (prefixNum >= 480 && prefixNum <= 499) return 'MI';
  if (prefixNum >= 500 && prefixNum <= 528) return 'IA';
  if (prefixNum >= 530 && prefixNum <= 549) return 'WI';
  if (prefixNum >= 550 && prefixNum <= 567) return 'MN';
  if (prefixNum >= 570 && prefixNum <= 577) return 'SD';
  if (prefixNum >= 580 && prefixNum <= 588) return 'ND';
  if (prefixNum >= 590 && prefixNum <= 599) return 'MT';
  if (prefixNum >= 600 && prefixNum <= 629) return 'IL';
  if (prefixNum >= 630 && prefixNum <= 658) return 'MO';
  if (prefixNum >= 660 && prefixNum <= 679) return 'KS';
  if (prefixNum >= 680 && prefixNum <= 693) return 'NE';
  if (prefixNum >= 700 && prefixNum <= 714) return 'LA';
  if (prefixNum >= 716 && prefixNum <= 729) return 'AR';
  if (prefixNum >= 730 && prefixNum <= 739) return 'OK';
  if (prefixNum >= 740 && prefixNum <= 741) return 'OK';
  if (prefixNum >= 750 && prefixNum <= 799) return 'TX';
  if (prefixNum >= 800 && prefixNum <= 816) return 'CO';
  if (prefixNum >= 820 && prefixNum <= 831) return 'WY';
  if (prefixNum >= 832 && prefixNum <= 838) return 'ID';
  if (prefixNum >= 840 && prefixNum <= 847) return 'UT';
  if (prefixNum >= 850 && prefixNum <= 865) return 'AZ';
  if (prefixNum >= 870 && prefixNum <= 884) return 'NM';
  if (prefixNum >= 885 && prefixNum <= 885) return 'TX';
  if (prefixNum >= 889 && prefixNum <= 898) return 'NV';
  if (prefixNum >= 900 && prefixNum <= 961) return 'CA';
  if (prefixNum >= 970 && prefixNum <= 979) return 'OR';
  if (prefixNum >= 980 && prefixNum <= 994) return 'WA';
  if (prefixNum >= 995 && prefixNum <= 999) return 'AK';
  if (prefixNum >= 6 && prefixNum <= 9) return 'PR';
  if (prefixNum >= 10 && prefixNum <= 27) return 'MA';
  if (prefixNum >= 28 && prefixNum <= 29) return 'RI';
  if (prefixNum >= 30 && prefixNum <= 38) return 'NH';
  if (prefixNum >= 39 && prefixNum <= 49) return 'ME';
  if (prefixNum >= 50 && prefixNum <= 59) return 'VT';
  if (prefixNum >= 60 && prefixNum <= 69) return 'CT';
  if (prefixNum >= 70 && prefixNum <= 89) return 'NJ';
  
  return 'US'; // Default to US national
}

// Enhanced ZIP prefix mapping for database storage
function getZipPrefix(zipCode: string): string {
  return zipCode.substring(0, 3);
}

// Enhanced EIA series mapping for broader state coverage
const EIA_SERIES_MAP: Record<string, Record<string, string>> = {
  'CA': { 'gasoline': 'PET.EMM_EPMRU_PTE_SCA_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SCA_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SCA_DPG.W' },
  'TX': { 'gasoline': 'PET.EMM_EPMRU_PTE_STX_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_STX_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_STX_DPG.W' },
  'NY': { 'gasoline': 'PET.EMM_EPMRU_PTE_SNY_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SNY_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SNY_DPG.W' },
  'FL': { 'gasoline': 'PET.EMM_EPMRU_PTE_SFL_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SFL_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SFL_DPG.W' },
  'IL': { 'gasoline': 'PET.EMM_EPMRU_PTE_SIL_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SIL_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SIL_DPG.W' },
  'PA': { 'gasoline': 'PET.EMM_EPMRU_PTE_SPA_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SPA_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SPA_DPG.W' },
  'OH': { 'gasoline': 'PET.EMM_EPMRU_PTE_SOH_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SOH_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SOH_DPG.W' },
  'GA': { 'gasoline': 'PET.EMM_EPMRU_PTE_SGA_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SGA_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SGA_DPG.W' },
  'NC': { 'gasoline': 'PET.EMM_EPMRU_PTE_SNC_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SNC_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SNC_DPG.W' },
  'MI': { 'gasoline': 'PET.EMM_EPMRU_PTE_SMI_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SMI_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SMI_DPG.W' },
  'NJ': { 'gasoline': 'PET.EMM_EPMRU_PTE_SNJ_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SNJ_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SNJ_DPG.W' },
  'VA': { 'gasoline': 'PET.EMM_EPMRU_PTE_SVA_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SVA_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SVA_DPG.W' },
  'WA': { 'gasoline': 'PET.EMM_EPMRU_PTE_SWA_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SWA_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SWA_DPG.W' },
  'AZ': { 'gasoline': 'PET.EMM_EPMRU_PTE_SAZ_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SAZ_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SAZ_DPG.W' },
  'MA': { 'gasoline': 'PET.EMM_EPMRU_PTE_SMA_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SMA_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SMA_DPG.W' },
  'TN': { 'gasoline': 'PET.EMM_EPMRU_PTE_STN_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_STN_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_STN_DPG.W' },
  'IN': { 'gasoline': 'PET.EMM_EPMRU_PTE_SIN_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SIN_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SIN_DPG.W' },
  'MO': { 'gasoline': 'PET.EMM_EPMRU_PTE_SMO_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SMO_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SMO_DPG.W' },
  'WI': { 'gasoline': 'PET.EMM_EPMRU_PTE_SWI_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SWI_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SWI_DPG.W' },
  'MN': { 'gasoline': 'PET.EMM_EPMRU_PTE_SMN_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SMN_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SMN_DPG.W' },
  'CO': { 'gasoline': 'PET.EMM_EPMRU_PTE_SCO_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SCO_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SCO_DPG.W' },
  'AL': { 'gasoline': 'PET.EMM_EPMRU_PTE_SAL_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SAL_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SAL_DPG.W' },
  'LA': { 'gasoline': 'PET.EMM_EPMRU_PTE_SLA_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SLA_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SLA_DPG.W' },
  'KY': { 'gasoline': 'PET.EMM_EPMRU_PTE_SKY_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SKY_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SKY_DPG.W' },
  'SC': { 'gasoline': 'PET.EMM_EPMRU_PTE_SSC_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SSC_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SSC_DPG.W' },
  'OK': { 'gasoline': 'PET.EMM_EPMRU_PTE_SOK_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SOK_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SOK_DPG.W' },
  'AR': { 'gasoline': 'PET.EMM_EPMRU_PTE_SAR_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_SAR_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_SAR_DPG.W' },
  'US': { 'gasoline': 'PET.EMM_EPMRU_PTE_NUS_DPG.W', 'diesel': 'PET.EMD_EPLLPA_PTE_NUS_DPG.W', 'premium': 'PET.EMM_EPMRU_PTE_NUS_DPG.W' }
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

    // Enhanced state determination with ZIP prefix logic
    const state_code = getStateFromZip(zip_code);
    const zip_prefix = getZipPrefix(zip_code);
    
    console.log(`📍 ZIP ${zip_code} → State: ${state_code}, Prefix: ${zip_prefix}`);
    
    // Get EIA series ID for this state and fuel type
    const seriesId = EIA_SERIES_MAP[state_code]?.[fuel_type];
    if (!seriesId) {
      throw new Error(`No EIA series found for state ${state_code} and fuel type ${fuel_type}`);
    }

    // Enhanced caching: Check for both specific ZIP and ZIP prefix data
    const { data: cachedData, error: cacheError } = await supabase
      .from('regional_fuel_costs')
      .select('*')
      .or(`zip_code.eq.${zip_code},zip_code.eq.${zip_prefix}000`)
      .eq('fuel_type', fuel_type)
      .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('updated_at', { ascending: false })
      .limit(1)
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

    // Enhanced database caching with ZIP prefix and state-level data
    const cacheEntries = [
      // Cache for specific ZIP
      {
        zip_code,
        state_code,
        fuel_type,
        area_name: `${state_code} State`,
        period: date,
        product_name: fuel_type.charAt(0).toUpperCase() + fuel_type.slice(1),
        cost_per_gallon: costPerGallon,
        price: costPerGallon,
        source: 'eia.gov',
        updated_at: new Date().toISOString()
      },
      // Cache for ZIP prefix (benefits neighboring ZIPs)
      {
        zip_code: `${zip_prefix}000`,
        state_code,
        fuel_type,
        area_name: `${state_code} State - ZIP ${zip_prefix}xxx`,
        period: date,
        product_name: fuel_type.charAt(0).toUpperCase() + fuel_type.slice(1),
        cost_per_gallon: costPerGallon,
        price: costPerGallon,
        source: 'eia.gov',
        updated_at: new Date().toISOString()
      }
    ];

    // Batch upsert with comprehensive error handling
    const { error: upsertError } = await supabase
      .from('regional_fuel_costs')
      .upsert(cacheEntries, { 
        onConflict: 'zip_code,fuel_type',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      console.error('❌ Enhanced cache upsert error:', upsertError);
      // Try individual inserts as fallback
      for (const entry of cacheEntries) {
        try {
          await supabase.from('regional_fuel_costs').upsert(entry, { onConflict: 'zip_code,fuel_type' });
        } catch (individualError) {
          console.warn(`⚠️ Individual cache entry failed for ${entry.zip_code}:`, individualError);
        }
      }
    } else {
      console.log(`✅ Successfully cached fuel price for ZIP ${zip_code} and prefix ${zip_prefix}xxx`);
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