
import { supabase } from '@/integrations/supabase/client';
import { MarketListing } from '@/types/marketListing';
import { toast } from 'sonner';

export interface MarketSearchParams {
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  zipCode: string;
  radius?: number;
  vin?: string;
}

export interface MarketSearchResult {
  listings: MarketListing[];
  trust: number;
  source: string;
  notes: string;
  totalFound: number;
  searchMethod: 'openai' | 'database' | 'fallback';
}

/**
 * Enhanced market search agent using OpenAI web search + database fallback
 */
export async function searchMarketListings(params: MarketSearchParams): Promise<MarketSearchResult> {
  console.log('🔍 [MARKET_SEARCH_AGENT] Starting search with params:', params);
  
  try {
    // First, try OpenAI web search for real-time listings
    const openaiResult = await searchWithOpenAI(params);
    if (openaiResult.listings.length > 0) {
      console.log(`✅ [MARKET_SEARCH_AGENT] Found ${openaiResult.listings.length} listings via OpenAI`);
      return openaiResult;
    }
    
    // Fallback to database search
    console.log('🔄 [MARKET_SEARCH_AGENT] OpenAI search returned no results, trying database...');
    const dbResult = await searchDatabase(params);
    if (dbResult.listings.length > 0) {
      console.log(`✅ [MARKET_SEARCH_AGENT] Found ${dbResult.listings.length} listings in database`);
      return dbResult;
    }
    
    // Final fallback - return empty with clear indication
    console.log('❌ [MARKET_SEARCH_AGENT] No listings found via any method');
    return {
      listings: [],
      trust: 0.2,
      source: 'fallback',
      notes: 'No current market listings found via OpenAI search or database. Using synthetic pricing model.',
      totalFound: 0,
      searchMethod: 'fallback'
    };
    
  } catch (error) {
    console.error('❌ [MARKET_SEARCH_AGENT] Search failed:', error);
    return {
      listings: [],
      trust: 0.1,
      source: 'error',
      notes: `Market search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      totalFound: 0,
      searchMethod: 'fallback'
    };
  }
}

/**
 * Search using OpenAI web browsing for real-time listings
 */
async function searchWithOpenAI(params: MarketSearchParams): Promise<MarketSearchResult> {
  try {
    console.log('🤖 [OPENAI_SEARCH] Calling OpenAI market search function...');
    
    const { data, error } = await supabase.functions.invoke('openai-market-search', {
      body: {
        make: params.make,
        model: params.model,
        year: params.year,
        trim: params.trim,
        zip: params.zipCode,
        mileage: params.mileage,
        radius: params.radius || 100
      }
    });
    
    if (error) {
      console.error('❌ [OPENAI_SEARCH] Function call failed:', error);
      throw new Error(`OpenAI search failed: ${error.message}`);
    }
    
    if (!data || !data.success) {
      console.warn('⚠️ [OPENAI_SEARCH] No successful response from OpenAI');
      return {
        listings: [],
        trust: 0.3,
        source: 'openai_no_results',
        notes: 'OpenAI search completed but found no listings',
        totalFound: 0,
        searchMethod: 'openai'
      };
    }
    
    // Transform OpenAI results to MarketListing format
    const listings: MarketListing[] = (data.data || []).map((item: any) => ({
      id: item.id || `openai-${Date.now()}-${Math.random()}`,
      source: item.source || 'OpenAI Search',
      source_type: 'marketplace',
      price: item.price || 0,
      year: item.year || params.year,
      make: item.make || params.make,
      model: item.model || params.model,
      trim: item.trim,
      vin: item.vin,
      mileage: item.mileage,
      condition: item.condition || 'used',
      dealer_name: item.dealerName || item.dealer_name,
      location: item.location || params.zipCode,
      listing_url: item.link || item.listing_url || '#',
      is_cpo: item.isCpo || false,
      fetched_at: new Date().toISOString(),
      confidence_score: item.confidenceScore || 85
    }));
    
    console.log(`✅ [OPENAI_SEARCH] Processed ${listings.length} listings from OpenAI`);
    
    return {
      listings,
      trust: data.meta?.confidence / 100 || 0.8,
      source: 'openai_web_search',
      notes: `Found ${listings.length} listings via OpenAI web search`,
      totalFound: listings.length,
      searchMethod: 'openai'
    };
    
  } catch (error) {
    console.error('❌ [OPENAI_SEARCH] Error:', error);
    throw error;
  }
}

/**
 * Search database for existing market listings
 */
async function searchDatabase(params: MarketSearchParams): Promise<MarketSearchResult> {
  try {
    console.log('🗃️ [DB_SEARCH] Searching database for market listings...');
    
    let query = supabase
      .from('market_listings')
      .select('*')
      .eq('make', params.make)
      .eq('model', params.model)
      .eq('year', params.year)
      .order('fetched_at', { ascending: false });
    
    // Add optional filters
    if (params.zipCode) {
      query = query.eq('zip_code', params.zipCode);
    }
    
    const { data, error } = await query.limit(20);
    
    if (error) {
      console.error('❌ [DB_SEARCH] Database query failed:', error);
      throw new Error(`Database search failed: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log('📭 [DB_SEARCH] No listings found in database');
      return {
        listings: [],
        trust: 0.4,
        source: 'database_empty',
        notes: 'No listings found in database',
        totalFound: 0,
        searchMethod: 'database'
      };
    }
    
    // Transform database results to MarketListing format
    const listings: MarketListing[] = data.map(item => ({
      id: item.id || `db-${Date.now()}-${Math.random()}`,
      source: item.source || 'Database',
      source_type: item.source_type || 'marketplace',
      price: item.price || 0,
      year: item.year || params.year,
      make: item.make || params.make,
      model: item.model || params.model,
      trim: item.trim,
      vin: item.vin,
      mileage: item.mileage,
      condition: item.condition || 'used',
      dealer_name: item.dealer_name,
      location: item.location || params.zipCode,
      listing_url: item.listing_url || '#',
      is_cpo: item.is_cpo || false,
      fetched_at: item.fetched_at || new Date().toISOString(),
      confidence_score: item.confidence_score || 75
    }));
    
    console.log(`✅ [DB_SEARCH] Found ${listings.length} listings in database`);
    
    return {
      listings,
      trust: 0.7,
      source: 'database',
      notes: `Found ${listings.length} listings in database`,
      totalFound: listings.length,
      searchMethod: 'database'
    };
    
  } catch (error) {
    console.error('❌ [DB_SEARCH] Error:', error);
    throw error;
  }
}

/**
 * Generate search query prompt for OpenAI
 */
export function buildSearchQuery(params: MarketSearchParams): string {
  const { make, model, year, trim, mileage, zipCode, radius = 100 } = params;
  
  let query = `Find real used car listings for a ${year} ${make} ${model}`;
  if (trim) query += ` ${trim}`;
  if (mileage) query += ` with approximately ${mileage.toLocaleString()} miles`;
  query += ` near ZIP code ${zipCode} within ${radius} miles`;
  
  query += `. Search popular automotive marketplaces like AutoTrader, CarGurus, Cars.com, CarMax, Carvana, Facebook Marketplace, and Craigslist.`;
  
  return query;
}
