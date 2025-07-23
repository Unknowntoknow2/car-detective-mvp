
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

export interface EnhancedMarketSearchResult {
  listings: MarketListing[];
  trust: number;
  source: string;
  notes: string;
  totalFound: number;
  searchMethod: 'lovable_intelligence' | 'openai' | 'database' | 'fallback';
}

/**
 * Enhanced market search agent using OpenAI web search + database fallback
 */
export async function searchMarketListings(params: MarketSearchParams): Promise<EnhancedMarketSearchResult> {
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
 * Lovable-style automotive market intelligence search
 */
async function searchWithOpenAI(params: MarketSearchParams): Promise<EnhancedMarketSearchResult> {
  try {
    console.log('🚀 [LOVABLE_INTELLIGENCE] Launching Google-style market intelligence search...');
    
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
      console.error('❌ [LOVABLE_INTELLIGENCE] Function call failed:', error);
      throw new Error(`Market intelligence search failed: ${error.message}`);
    }
    
    if (!data || !data.success) {
      console.warn('⚠️ [LOVABLE_INTELLIGENCE] No successful response from market intelligence');
      return {
        listings: [],
        trust: 0.3,
        source: 'intelligence_no_results',
        notes: 'Market intelligence search completed but found no current listings',
        totalFound: 0,
        searchMethod: 'lovable_intelligence'
      };
    }
    
    // Transform Lovable intelligence results to MarketListing format
    const listings: MarketListing[] = (data.data || []).map((item: any) => ({
      id: item.id || crypto.randomUUID(),
      source: item.source || 'Live Market Search',
      sourceType: 'live',
      source_type: 'marketplace',
      price: item.price || 0,
      year: item.year || params.year,
      make: item.make || params.make,
      model: item.model || params.model,
      trim: item.trim,
      vin: item.vin,
      mileage: item.mileage,
      condition: item.condition || 'used',
      dealer: item.dealerName,
      dealerName: item.dealerName,
      dealer_name: item.dealerName || item.dealer_name,
      location: item.location || params.zipCode,
      zip: params.zipCode,
      zipCode: params.zipCode,
      link: item.link || item.listingUrl,
      listingUrl: item.listingUrl || item.link,
      listing_url: item.listingUrl || item.link || '#',
      photos: item.imageUrl ? [item.imageUrl] : [],
      isCpo: item.isCpo || false,
      is_cpo: item.isCpo || false,
      fetchedAt: new Date().toISOString(),
      fetched_at: new Date().toISOString(),
      confidenceScore: item.confidenceScore || 85,
      confidence_score: item.confidenceScore || 85
    }));
    
    // Filter for valid listings
    const validListings = listings.filter(listing => 
      listing.price > 1000 && 
      listing.price < 500000 &&
      listing.make && 
      listing.model &&
      listing.source
    );
    
    console.log(`✅ [LOVABLE_INTELLIGENCE] Processed ${validListings.length}/${listings.length} valid listings`);
    
    // Calculate trust score based on listing quality and quantity
    const trustScore = Math.min(
      0.9, // Max 90% trust
      0.5 + (validListings.length >= 10 ? 0.4 : validListings.length >= 5 ? 0.3 : validListings.length >= 1 ? 0.2 : 0)
    );
    
    return {
      listings: validListings,
      trust: trustScore,
      source: 'lovable_market_intelligence',
      notes: validListings.length > 0 
        ? `Found ${validListings.length} real listings via Google-style market intelligence from ${data.meta?.sources?.length || 'multiple'} sources`
        : 'No current listings found matching your criteria. Try expanding search radius or adjusting filters.',
      totalFound: validListings.length,
      searchMethod: 'lovable_intelligence'
    };
    
  } catch (error) {
    console.error('❌ [LOVABLE_INTELLIGENCE] Error:', error);
    throw error;
  }
}

/**
 * Search database for existing market listings
 */
async function searchDatabase(params: MarketSearchParams): Promise<EnhancedMarketSearchResult> {
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
