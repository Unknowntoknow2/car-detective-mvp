
import { supabase } from "@/integrations/supabase/client";
import type { MarketListing } from "@/types/valuation";

export interface MarketSearchResult {
  listings: MarketListing[];
  source: string;
  trust: number;
  notes: string;
}

/**
 * Enhanced market search with comprehensive error logging
 */
export async function fetchMarketComps(
  make: string,
  model: string,
  year: number,
  zipCode: string,
  vin?: string
): Promise<MarketSearchResult> {
  console.log('[MARKET_SEARCH DEBUG] Starting market search with params:', {
    make, model, year, zipCode, vin
  });

  try {
    // Validate input parameters
    if (!make || !model || !year || !zipCode) {
      console.error('[MARKET_SEARCH ERROR] Missing required parameters:', {
        make: !!make,
        model: !!model,
        year: !!year,
        zipCode: !!zipCode
      });
      return {
        listings: [],
        source: 'validation_error',
        trust: 0,
        notes: 'Missing required search parameters'
      };
    }

    console.log('[MARKET_SEARCH DEBUG] Invoking openai-web-search edge function...');

    // Call the OpenAI web search edge function with enhanced error handling
    const { data, error } = await supabase.functions.invoke('openai-web-search', {
      body: {
        make: make.toUpperCase(),
        model: model,
        year: year,
        zipCode: zipCode,
        vin: vin || null,
        saveToDb: true
      }
    });

    // Log the raw response for debugging
    console.log('[MARKET_SEARCH DEBUG] Edge function raw response:', {
      data,
      error,
      hasData: !!data,
      hasError: !!error
    });

    if (error) {
      console.error('[MARKET_SEARCH ERROR] Edge function returned error:', error);
      return {
        listings: [],
        source: 'edge_function_error',
        trust: 0,
        notes: `Edge function error: ${error.message || 'Unknown error'}`
      };
    }

    if (!data) {
      console.error('[MARKET_SEARCH ERROR] No data returned from edge function');
      return {
        listings: [],
        source: 'no_data_returned',
        trust: 0,
        notes: 'Edge function returned no data'
      };
    }

    // Check if the response indicates an error
    if (data.error) {
      console.error('[MARKET_SEARCH ERROR] API error in response:', data.error);
      return {
        listings: [],
        source: 'api_error',
        trust: 0,
        notes: `API error: ${data.error}`
      };
    }

    const listings = data.listings || [];
    const listingsFound = data.listingsFound || listings.length;

    console.log('[MARKET_SEARCH DEBUG] Processing listings from API:', {
      listingsCount: listings.length,
      listingsFound,
      searchQuery: data.searchQuery
    });

    if (!listings || listings.length === 0) {
      console.warn('[MARKET_SEARCH WARNING] No listings found in API response');
      return {
        listings: [],
        source: 'openai_search_empty',
        trust: 0.1,
        notes: `No listings found for ${year} ${make} ${model} in ${zipCode}`
      };
    }

    // Transform API listings to MarketListing format
    const transformedListings: MarketListing[] = listings.map((listing: any, index: number) => {
      console.log(`[MARKET_SEARCH DEBUG] Transforming listing ${index + 1}:`, listing);
      
      return {
        id: listing.id || `listing-${Date.now()}-${index}`,
        price: listing.price || 0,
        mileage: listing.mileage || null,
        source: listing.source || listing.dealer_name || 'Unknown',
        source_type: listing.source_type || 'dealer',
        listing_url: listing.listing_url || '#',
        dealer_name: listing.dealer_name || listing.source,
        location: listing.zip_code || zipCode,
        make: make.toUpperCase(),
        model: model,
        year: year,
        vin: vin || null,
        fetched_at: listing.fetched_at || new Date().toISOString(),
        confidence_score: listing.confidence_score || 85
      };
    });

    const finalTrust = calculateTrustScore(transformedListings);
    
    console.log('[MARKET_SEARCH SUCCESS] Market search completed:', {
      listingsCount: transformedListings.length,
      averagePrice: transformedListings.reduce((sum, l) => sum + l.price, 0) / transformedListings.length,
      trustScore: finalTrust,
      sources: transformedListings.map(l => l.source)
    });

    return {
      listings: transformedListings,
      source: 'openai_search',
      trust: finalTrust,
      notes: `Found ${transformedListings.length} listings from OpenAI search`
    };

  } catch (error) {
    console.error('[MARKET_SEARCH CRITICAL ERROR] Unexpected error in fetchMarketComps:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      params: { make, model, year, zipCode, vin }
    });

    return {
      listings: [],
      source: 'critical_error',
      trust: 0,
      notes: `Critical error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    };
  }
}

/**
 * Calculate trust score based on listing quality and quantity
 */
function calculateTrustScore(listings: MarketListing[]): number {
  if (!listings || listings.length === 0) {
    return 0;
  }

  let trust = 0.3; // Base trust

  // Bonus for quantity
  if (listings.length >= 3) trust += 0.2;
  if (listings.length >= 5) trust += 0.1;

  // Bonus for price consistency (low variance)
  const prices = listings.map(l => l.price).filter(p => p > 0);
  if (prices.length >= 2) {
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
    const coefficientOfVariation = Math.sqrt(variance) / avgPrice;
    
    if (coefficientOfVariation < 0.15) trust += 0.15; // Very consistent
    else if (coefficientOfVariation < 0.25) trust += 0.1; // Moderately consistent
  }

  // Bonus for dealer sources
  const dealerCount = listings.filter(l => l.source_type === 'dealer').length;
  trust += (dealerCount / listings.length) * 0.15;

  return Math.min(trust, 0.9); // Cap at 90%
}

/**
 * Fallback market search using database cache
 */
export async function fetchCachedMarketComps(
  make: string,
  model: string,
  year: number,
  zipCode: string
): Promise<MarketSearchResult> {
  console.log('[MARKET_SEARCH DEBUG] Fetching cached market comps:', {
    make, model, year, zipCode
  });

  try {
    const { data, error } = await supabase
      .from('market_listings')
      .select('*')
      .eq('make', make.toUpperCase())
      .eq('model', model)
      .eq('year', year)
      .gte('fetched_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
      .order('fetched_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('[MARKET_SEARCH ERROR] Cache query failed:', error);
      return {
        listings: [],
        source: 'cache_error',
        trust: 0,
        notes: `Cache error: ${error.message}`
      };
    }

    if (!data || data.length === 0) {
      console.log('[MARKET_SEARCH INFO] No cached listings found');
      return {
        listings: [],
        source: 'cache_empty',
        trust: 0,
        notes: 'No cached listings available'
      };
    }

    const cachedListings: MarketListing[] = data.map(listing => ({
      id: listing.id,
      price: listing.price,
      mileage: listing.mileage,
      source: listing.source,
      source_type: listing.source_type,
      listing_url: listing.listing_url,
      dealer_name: listing.dealer_name,
      location: listing.zip_code,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      vin: listing.vin,
      fetched_at: listing.fetched_at,
      confidence_score: listing.confidence_score || 75
    }));

    const trust = calculateTrustScore(cachedListings) * 0.8; // Reduce trust for cached data

    console.log('[MARKET_SEARCH SUCCESS] Using cached listings:', {
      count: cachedListings.length,
      trust
    });

    return {
      listings: cachedListings,
      source: 'cached_listings',
      trust,
      notes: `Using ${cachedListings.length} cached listings (last 7 days)`
    };

  } catch (error) {
    console.error('[MARKET_SEARCH ERROR] Cache fallback failed:', error);
    return {
      listings: [],
      source: 'cache_fallback_error',
      trust: 0,
      notes: `Cache fallback error: ${error instanceof Error ? error.message : 'Unknown'}`
    };
  }
}
