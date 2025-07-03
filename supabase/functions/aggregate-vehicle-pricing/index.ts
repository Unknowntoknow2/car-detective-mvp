import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VehicleSearchParams {
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin?: string;
  zipCode?: string;
  sources?: string[]; // Optional: specify which sources to scrape
}

interface PricingData {
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price: number;
  mileage?: number;
  location?: string;
  zip_code?: string;
  dealer_name?: string;
  source_name: string;
  source_type: string;
  stock_number?: string;
  listing_url?: string;
  cpo_status?: boolean;
  vehicle_condition?: string;
  date_listed?: string;
  incentives?: string;
  markdown_notes?: string;
  offer_type: string;
  provenance: Record<string, any>;
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
    const params: VehicleSearchParams = await req.json();
    console.log('🚀 Starting FANG-level data aggregation for:', params);

    // Get active data sources
    const { data: sources, error: sourcesError } = await supabase
      .from('data_sources')
      .select('*')
      .eq('is_active', true);

    if (sourcesError) {
      throw new Error(`Failed to fetch data sources: ${sourcesError.message}`);
    }

    const results: PricingData[] = [];
    const errors: string[] = [];

    // Filter sources if specified
    const targetSources = params.sources 
      ? sources.filter(s => params.sources!.includes(s.source_name))
      : sources;

    console.log(`📊 Targeting ${targetSources.length} data sources`);

    // Process sources in parallel with rate limiting
    const sourcePromises = targetSources.map(async (source) => {
      try {
        console.log(`🔍 Scraping ${source.source_name}...`);
        
        const sourceResults = await scrapeSource(source, params);
        results.push(...sourceResults);
        
        // Update last scraped timestamp
        await supabase
          .from('data_sources')
          .update({ last_scraped: new Date().toISOString() })
          .eq('id', source.id);
          
        console.log(`✅ ${source.source_name}: Found ${sourceResults.length} listings`);
      } catch (error) {
        const errorMsg = `❌ ${source.source_name}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    });

    // Also invoke marketplace and OEM data scrapers in parallel
    const additionalScrapers = [
      invokeMarketplaceScraper(params),
      invokeOEMDataFetcher(params),
      invokeAuctionScrapers(params)
    ];

    const [, marketplaceResults, oemResults, auctionResults] = await Promise.allSettled([
      Promise.allSettled(sourcePromises),
      ...additionalScrapers
    ]);

    // Process additional scraper results
    if (marketplaceResults.status === 'fulfilled' && marketplaceResults.value) {
      console.log(`🏪 Marketplace scraper: ${marketplaceResults.value.total || 0} results`);
    }
    if (oemResults.status === 'fulfilled' && oemResults.value) {
      console.log(`🏭 OEM data fetcher: completed`);
    }
    if (auctionResults.status === 'fulfilled' && auctionResults.value) {
      console.log(`🏛️ Auction scrapers: ${auctionResults.value.total || 0} results`);
    }

    await Promise.allSettled(sourcePromises);

    // Save results to database
    if (results.length > 0) {
      const { error: insertError } = await supabase
        .from('vehicle_pricing_data')
        .insert(results);

      if (insertError) {
        console.error('Database insert error:', insertError);
        errors.push(`Database error: ${insertError.message}`);
      } else {
        console.log(`💾 Saved ${results.length} pricing records to database`);
      }
    }

    // Update pricing analytics
    await updatePricingAnalytics(params);

    return new Response(JSON.stringify({
      success: true,
      total_results: results.length,
      sources_scraped: targetSources.length,
      sources_successful: targetSources.length - errors.length,
      results: results,
      errors: errors,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Aggregation error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function scrapeSource(source: any, params: VehicleSearchParams): Promise<PricingData[]> {
  const results: PricingData[] = [];
  
  // Build search URL based on source pattern
  const searchUrl = buildSearchUrl(source, params);
  console.log(`🔗 Search URL for ${source.source_name}: ${searchUrl}`);

  switch (source.source_name) {
    case 'CarMax':
      return await scrapeCarMax(searchUrl, params, source);
    case 'Carvana':
      return await scrapeCarvana(searchUrl, params, source);
    case 'AutoTrader':
      return await scrapeAutoTrader(searchUrl, params, source);
    case 'Cars.com':
      return await scrapeCarsDotCom(searchUrl, params, source);
    case 'CarGurus':
      return await scrapeCarGurus(searchUrl, params, source);
    default:
      return await scrapeGeneric(searchUrl, params, source);
  }
}

function buildSearchUrl(source: any, params: VehicleSearchParams): string {
  let url = source.base_url;
  
  if (source.search_pattern) {
    url += source.search_pattern
      .replace('{make}', encodeURIComponent(params.make.toLowerCase()))
      .replace('{model}', encodeURIComponent(params.model.toLowerCase()))
      .replace('{year}', params.year.toString());
  }
  
  return url;
}

async function scrapeCarMax(url: string, params: VehicleSearchParams, source: any): Promise<PricingData[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // CarMax-specific parsing logic
    const results: PricingData[] = [];
    
    // This would contain actual HTML parsing logic for CarMax
    // For now, returning mock data structure
    console.log(`📝 CarMax HTML length: ${html.length} characters`);
    
    return results;
  } catch (error) {
    throw new Error(`CarMax scraping failed: ${error.message}`);
  }
}

async function scrapeCarvana(url: string, params: VehicleSearchParams, source: any): Promise<PricingData[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const results: PricingData[] = [];
    
    // Carvana-specific parsing logic would go here
    console.log(`📝 Carvana API response:`, data);
    
    return results;
  } catch (error) {
    throw new Error(`Carvana scraping failed: ${error.message}`);
  }
}

async function scrapeAutoTrader(url: string, params: VehicleSearchParams, source: any): Promise<PricingData[]> {
  // AutoTrader scraping implementation
  return [];
}

async function scrapeCarsDotCom(url: string, params: VehicleSearchParams, source: any): Promise<PricingData[]> {
  // Cars.com scraping implementation
  return [];
}

async function scrapeCarGurus(url: string, params: VehicleSearchParams, source: any): Promise<PricingData[]> {
  // CarGurus scraping implementation
  return [];
}

async function scrapeGeneric(url: string, params: VehicleSearchParams, source: any): Promise<PricingData[]> {
  try {
    console.log(`🌐 Generic scraping for ${source.source_name}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Generic HTML parsing logic would extract basic pricing info
    console.log(`📝 Generic scraping - HTML length: ${html.length} characters`);
    
    return [];
  } catch (error) {
    throw new Error(`Generic scraping failed: ${error.message}`);
  }
}

async function invokeMarketplaceScraper(params: VehicleSearchParams) {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-marketplace', {
      body: params
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Marketplace scraper error:', error);
    return null;
  }
}

async function invokeOEMDataFetcher(params: VehicleSearchParams) {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-oem-data', {
      body: params
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('OEM data fetcher error:', error);
    return null;
  }
}

async function invokeAuctionScrapers(params: VehicleSearchParams) {
  try {
    const [manheimResult] = await Promise.allSettled([
      supabase.functions.invoke('scrape-manheim', { body: params })
    ]);
    
    let totalResults = 0;
    if (manheimResult.status === 'fulfilled' && manheimResult.value.data) {
      totalResults += manheimResult.value.data.total || 0;
    }
    
    return { total: totalResults };
  } catch (error) {
    console.error('Auction scrapers error:', error);
    return null;
  }
}

async function updatePricingAnalytics(params: VehicleSearchParams) {
  try {
    // Calculate analytics from recent pricing data
    const { data: pricingData } = await supabase
      .from('vehicle_pricing_data')
      .select('price, mileage')
      .eq('year', params.year)
      .eq('make', params.make)
      .eq('model', params.model)
      .gte('date_scraped', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('date_scraped', { ascending: false });

    if (pricingData && pricingData.length > 0) {
      const prices = pricingData.map(d => d.price).sort((a, b) => a - b);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const medianPrice = prices[Math.floor(prices.length / 2)];
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      await supabase
        .from('pricing_analytics')
        .upsert({
          year: params.year,
          make: params.make,
          model: params.model,
          trim: params.trim,
          avg_price: avgPrice,
          median_price: medianPrice,
          min_price: minPrice,
          max_price: maxPrice,
          sample_size: prices.length,
          analysis_period: 'weekly',
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'year,make,model,trim,analysis_period'
        });

      console.log(`📊 Updated pricing analytics: avg=$${avgPrice.toFixed(0)}, samples=${prices.length}`);
    }
  } catch (error) {
    console.error('Analytics update error:', error);
  }
}