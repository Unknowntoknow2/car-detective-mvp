import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OEMDataRequest {
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin?: string;
}

interface OEMDataResult {
  msrp_data: MSRPData[];
  recalls: RecallData[];
  tsbs: TSBData[];
  oem_specs: OEMSpecs;
  provenance: Record<string, any>;
}

interface MSRPData {
  trim_name: string;
  base_msrp: number;
  options?: OptionPackage[];
  model_year: number;
  source_url: string;
  effective_date: string;
}

interface OptionPackage {
  name: string;
  price: number;
  description: string;
}

interface RecallData {
  nhtsa_campaign_id: string;
  recall_date: string;
  component: string;
  summary: string;
  remedy: string;
  affected_vehicles: number;
  source_url: string;
}

interface TSBData {
  tsb_number: string;
  date_issued: string;
  subject: string;
  description: string;
  affected_component: string;
  source_url: string;
}

interface OEMSpecs {
  engine_options: string[];
  transmission_options: string[];
  drivetrain_options: string[];
  fuel_economy: Record<string, any>;
  dimensions: Record<string, any>;
  weights: Record<string, any>;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: OEMDataRequest = await req.json();
    console.log('🏭 OEM data fetch request:', params);

    const result: OEMDataResult = {
      msrp_data: [],
      recalls: [],
      tsbs: [],
      oem_specs: {
        engine_options: [],
        transmission_options: [],
        drivetrain_options: [],
        fuel_economy: {},
        dimensions: {},
        weights: {}
      },
      provenance: {
        timestamp: new Date().toISOString(),
        search_params: params
      }
    };

    // Fetch MSRP data from OEM sources
    console.log('💰 Fetching MSRP data...');
    const msrpData = await fetchMSRPData(params);
    result.msrp_data = msrpData;

    // Fetch NHTSA recalls
    console.log('🚨 Fetching NHTSA recalls...');
    const recalls = await fetchNHTSARecalls(params);
    result.recalls = recalls;

    // Fetch TSBs
    console.log('🔧 Fetching Technical Service Bulletins...');
    const tsbs = await fetchTSBData(params);
    result.tsbs = tsbs;

    // Fetch OEM specifications
    console.log('📋 Fetching OEM specifications...');
    const specs = await fetchOEMSpecs(params);
    result.oem_specs = specs;

    // Save to database if we have meaningful data
    if (result.msrp_data.length > 0 || result.recalls.length > 0 || result.tsbs.length > 0) {
      await saveOEMDataToDatabase(params, result);
    }

    return new Response(JSON.stringify({
      success: true,
      source: 'OEM Data Aggregator',
      data: result,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ OEM data fetch error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      source: 'OEM Data Aggregator'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchMSRPData(params: OEMDataRequest): Promise<MSRPData[]> {
  const msrpData: MSRPData[] = [];
  
  try {
    // OEM website MSRP fetch strategies
    const oemStrategies = [
      () => fetchOEMWebsiteMSRP(params),
      () => fetchEdmundsMSRP(params),
      () => fetchKBBMSRP(params),
      () => fetchNADAMSRP(params)
    ];

    for (const strategy of oemStrategies) {
      try {
        const data = await strategy();
        msrpData.push(...data);
      } catch (error) {
        console.log(`MSRP fetch strategy failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('MSRP data fetch error:', error);
  }
  
  return msrpData;
}

async function fetchOEMWebsiteMSRP(params: OEMDataRequest): Promise<MSRPData[]> {
  try {
    // Build OEM-specific URLs based on make
    const oemUrls = getOEMUrls(params.make, params.year, params.model);
    
    for (const url of oemUrls) {
      console.log(`🔗 Fetching MSRP from OEM: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        const html = await response.text();
        const msrpData = parseOEMPricingHTML(html, url, params);
        if (msrpData.length > 0) {
          return msrpData;
        }
      }
    }
    
    return [];
  } catch (error) {
    throw new Error(`OEM website MSRP fetch failed: ${error.message}`);
  }
}

async function fetchEdmundsMSRP(params: OEMDataRequest): Promise<MSRPData[]> {
  try {
    const edmundsUrl = `https://www.edmunds.com/${params.make.toLowerCase()}/${params.model.toLowerCase()}/${params.year}/`;
    console.log(`🔗 Fetching MSRP from Edmunds: ${edmundsUrl}`);
    
    const response = await fetch(edmundsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      return parseEdmundsPricingHTML(html, edmundsUrl, params);
    }
    
    return [];
  } catch (error) {
    throw new Error(`Edmunds MSRP fetch failed: ${error.message}`);
  }
}

async function fetchKBBMSRP(params: OEMDataRequest): Promise<MSRPData[]> {
  try {
    const kbbUrl = `https://www.kbb.com/${params.make.toLowerCase()}/${params.model.toLowerCase()}/${params.year}/`;
    console.log(`🔗 Fetching MSRP from KBB: ${kbbUrl}`);
    
    const response = await fetch(kbbUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      return parseKBBPricingHTML(html, kbbUrl, params);
    }
    
    return [];
  } catch (error) {
    throw new Error(`KBB MSRP fetch failed: ${error.message}`);
  }
}

async function fetchNADAMSRP(params: OEMDataRequest): Promise<MSRPData[]> {
  try {
    const nadaUrl = `https://www.nadaguides.com/Cars/${params.year}/${params.make}/${params.model}`;
    console.log(`🔗 Fetching MSRP from NADA: ${nadaUrl}`);
    
    const response = await fetch(nadaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      return parseNADAPricingHTML(html, nadaUrl, params);
    }
    
    return [];
  } catch (error) {
    throw new Error(`NADA MSRP fetch failed: ${error.message}`);
  }
}

async function fetchNHTSARecalls(params: OEMDataRequest): Promise<RecallData[]> {
  try {
    // Use NHTSA VPIC API
    const nhtsa_api_url = `https://vpic.nhtsa.dot.gov/api/vehicles/getrecallsbyvin/${params.vin}?format=json`;
    console.log(`🔗 Fetching recalls from NHTSA API: ${nhtsa_api_url}`);
    
    if (!params.vin) {
      // Fallback to make/model/year search
      const fallback_url = `https://www.nhtsa.gov/recalls?make=${params.make}&model=${params.model}&year=${params.year}`;
      console.log(`🔗 Fetching recalls from NHTSA web: ${fallback_url}`);
      
      const response = await fetch(fallback_url);
      if (response.ok) {
        const html = await response.text();
        return parseNHTSARecallsHTML(html, fallback_url, params);
      }
    } else {
      const response = await fetch(nhtsa_api_url);
      if (response.ok) {
        const data = await response.json();
        return parseNHTSARecallsAPI(data, nhtsa_api_url, params);
      }
    }
    
    return [];
  } catch (error) {
    console.error('NHTSA recalls fetch error:', error);
    return [];
  }
}

async function fetchTSBData(params: OEMDataRequest): Promise<TSBData[]> {
  try {
    // TSBs are typically found on NHTSA or OEM service sites
    const tsbSources = [
      `https://www.nhtsa.gov/vehicle-manufacturers/${params.make.toLowerCase()}`,
      `https://www.alldata.com/tsb/${params.make.toLowerCase()}/${params.model.toLowerCase()}/${params.year}`
    ];
    
    const allTSBs: TSBData[] = [];
    
    for (const url of tsbSources) {
      try {
        console.log(`🔗 Fetching TSBs from: ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          const html = await response.text();
          const tsbs = parseTSBHTML(html, url, params);
          allTSBs.push(...tsbs);
        }
      } catch (error) {
        console.log(`TSB source failed: ${error.message}`);
      }
    }
    
    return allTSBs;
  } catch (error) {
    console.error('TSB data fetch error:', error);
    return [];
  }
}

async function fetchOEMSpecs(params: OEMDataRequest): Promise<OEMSpecs> {
  try {
    const oemUrls = getOEMUrls(params.make, params.year, params.model);
    
    for (const url of oemUrls) {
      try {
        console.log(`🔗 Fetching OEM specs from: ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          const html = await response.text();
          const specs = parseOEMSpecsHTML(html, url, params);
          if (Object.keys(specs.engine_options).length > 0) {
            return specs;
          }
        }
      } catch (error) {
        console.log(`OEM specs source failed: ${error.message}`);
      }
    }
    
    return {
      engine_options: [],
      transmission_options: [],
      drivetrain_options: [],
      fuel_economy: {},
      dimensions: {},
      weights: {}
    };
  } catch (error) {
    console.error('OEM specs fetch error:', error);
    return {
      engine_options: [],
      transmission_options: [],
      drivetrain_options: [],
      fuel_economy: {},
      dimensions: {},
      weights: {}
    };
  }
}

function getOEMUrls(make: string, year: number, model: string): string[] {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase().replace(/\s+/g, '-');
  
  // OEM-specific URL patterns
  const oemPatterns: Record<string, string[]> = {
    'ford': [
      `https://www.ford.com/cars/${modelLower}/`,
      `https://www.ford.com/suvs/${modelLower}/`,
      `https://www.ford.com/trucks/${modelLower}/`
    ],
    'toyota': [
      `https://www.toyota.com/${modelLower}/`,
      `https://www.toyota.com/cars/${modelLower}/`,
      `https://www.toyota.com/suvs/${modelLower}/`
    ],
    'honda': [
      `https://www.honda.com/${modelLower}/`,
      `https://automobiles.honda.com/${modelLower}/`
    ],
    'chevrolet': [
      `https://www.chevrolet.com/cars/${modelLower}`,
      `https://www.chevrolet.com/suvs/${modelLower}`,
      `https://www.chevrolet.com/trucks/${modelLower}`
    ],
    'nissan': [
      `https://www.nissanusa.com/vehicles/cars/${modelLower}`,
      `https://www.nissanusa.com/vehicles/suvs/${modelLower}`
    ]
  };
  
  return oemPatterns[makeLower] || [`https://www.${makeLower}.com/${modelLower}/`];
}

// HTML parsing functions (simplified for demonstration)
function parseOEMPricingHTML(html: string, url: string, params: OEMDataRequest): MSRPData[] {
  console.log('📋 Parsing OEM pricing HTML...');
  // Real implementation would parse OEM price tables
  return [];
}

function parseEdmundsPricingHTML(html: string, url: string, params: OEMDataRequest): MSRPData[] {
  console.log('📋 Parsing Edmunds pricing HTML...');
  // Real implementation would parse Edmunds price data
  return [];
}

function parseKBBPricingHTML(html: string, url: string, params: OEMDataRequest): MSRPData[] {
  console.log('📋 Parsing KBB pricing HTML...');
  // Real implementation would parse KBB price data
  return [];
}

function parseNADAPricingHTML(html: string, url: string, params: OEMDataRequest): MSRPData[] {
  console.log('📋 Parsing NADA pricing HTML...');
  // Real implementation would parse NADA price data
  return [];
}

function parseNHTSARecallsHTML(html: string, url: string, params: OEMDataRequest): RecallData[] {
  console.log('📋 Parsing NHTSA recalls HTML...');
  // Real implementation would parse NHTSA recall tables
  return [];
}

function parseNHTSARecallsAPI(data: any, url: string, params: OEMDataRequest): RecallData[] {
  console.log('📋 Parsing NHTSA recalls API response...');
  // Real implementation would parse NHTSA API JSON
  return [];
}

function parseTSBHTML(html: string, url: string, params: OEMDataRequest): TSBData[] {
  console.log('📋 Parsing TSB HTML...');
  // Real implementation would parse TSB tables
  return [];
}

function parseOEMSpecsHTML(html: string, url: string, params: OEMDataRequest): OEMSpecs {
  console.log('📋 Parsing OEM specs HTML...');
  // Real implementation would parse OEM specification tables
  return {
    engine_options: [],
    transmission_options: [],
    drivetrain_options: [],
    fuel_economy: {},
    dimensions: {},
    weights: {}
  };
}

async function saveOEMDataToDatabase(params: OEMDataRequest, result: OEMDataResult) {
  try {
    // Save OEM data to appropriate tables
    console.log('💾 Saving OEM data to database...');
    
    // This would save to dedicated OEM data tables
    // For now, we'll log the structure
    console.log('OEM data structure ready for database storage:', {
      msrp_count: result.msrp_data.length,
      recalls_count: result.recalls.length,
      tsbs_count: result.tsbs.length,
      has_specs: Object.keys(result.oem_specs.engine_options).length > 0
    });
    
  } catch (error) {
    console.error('Database save error:', error);
  }
}