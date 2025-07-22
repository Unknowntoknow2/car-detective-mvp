
// src/agents/marketSearchAgent.ts

import { MarketListing, normalizeListing } from "@/types/marketListing";
import { supabase } from '@/integrations/supabase/client';

export interface MarketSearchInput {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
}

export interface MarketSearchResult {
  listings: MarketListing[];
  totalFound: number;
  searchQuery: string;
  confidence: number;
  trust: number;
  source: string;
  notes: string[];
}

export async function fetchMarketComps(input: MarketSearchInput): Promise<MarketSearchResult> {
  const listings = await searchMarketListings(input);
  const trust = listings.length > 0 ? Math.min(0.85, 0.5 + (listings.length * 0.05)) : 0.35;
  
  return {
    listings,
    totalFound: listings.length,
    searchQuery: `${input.year} ${input.make} ${input.model}`,
    confidence: listings.length > 0 ? Math.min(85, 50 + (listings.length * 5)) : 35,
    trust,
    source: listings.length > 0 ? 'live_market_search' : 'no_data',
    notes: listings.length > 0 
      ? [`Found ${listings.length} live listings`, 'Real-time market data available']
      : ['No live listings found', 'Consider using alternative valuation methods']
  };
}

/**
 * UNIFIED MARKET SEARCH AGENT
 * Single source of truth for all vehicle listings
 * Priority: Live web search → Database fallback
 */
export async function searchMarketListings(input: MarketSearchInput): Promise<MarketListing[]> {
  const { make, model, year, zipCode } = input;

  console.log('🎯 UNIFIED Market Search Agent - Starting search:', { make, model, year, zipCode });

  // Step 1: Attempt live web search first
  const liveListings = await attemptLiveSearch({ make, model, year, zipCode });
  
  if (liveListings.length > 0) {
    console.log(`✅ Live search successful: ${liveListings.length} listings found`);
    return liveListings.map(normalizeListing);
  }

  // Step 2: Fallback to database search
  console.info("🔄 Market listings fallback used: enhanced_market_listings (no live data found)");
  const dbListings = await fallbackDatabaseSearch({ make, model, year, zipCode });
  
  console.log(`📊 Database fallback returned: ${dbListings.length} listings`);
  return dbListings.map(normalizeListing);
}

/**
 * Attempt live web search using OpenAI-powered edge function
 */
async function attemptLiveSearch(params: { make: string; model: string; year: number; zipCode?: string }): Promise<MarketListing[]> {
  try {
    console.log('🌐 Attempting live web search...');
    
    const response = await supabase.functions.invoke('live-market-search', {
      body: {
        make: params.make,
        model: params.model,
        year: params.year,
        zipCode: params.zipCode,
        maxResults: 5
      }
    });

    if (response.error) {
      console.warn('⚠️ Live search error:', response.error);
      return [];
    }

    const { listings = [] } = response.data || {};
    
    // Convert to MarketListing format
    return listings.map((listing: any): MarketListing => ({
      id: `live-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      price: listing.price,
      mileage: listing.mileage || 0,
      year: listing.year || params.year,
      make: listing.make || params.make,
      model: listing.model || params.model,
      trim: listing.trim || '',
      condition: 'used',
      location: listing.location || '',
      source: listing.source || 'Live Web Search',
      sourceType: 'live',
      link: listing.link || '',
      dealerName: '',
      isCpo: false,
      fetchedAt: listing.fetchedAt || new Date().toISOString(),
      confidenceScore: 0.9 // High confidence for live data
    }));

  } catch (error) {
    console.warn('⚠️ Live search failed:', error);
    return [];
  }
}

/**
 * Fallback to database search when live search fails
 */
async function fallbackDatabaseSearch(params: { make: string; model: string; year: number; zipCode?: string }): Promise<MarketListing[]> {
  try {
    console.log('💾 Fallback: Searching database listings...');

    // Build database query with comprehensive filtering
    let query = supabase
      .from('enhanced_market_listings')
      .select('*')
      .ilike('make', params.make || '')
      .ilike('model', params.model || '')
      .eq('year', params.year)
      .eq('listing_status', 'active')
      .gt('price', 1000)
      .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    // Apply regional filtering if zipCode provided
    if (params.zipCode) {
      query = query.or(`zip_code.eq.${params.zipCode},geo_distance_miles.lte.100,geo_distance_miles.is.null`);
    }

    const { data: listings, error } = await query
      .order('updated_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Database search error:', error);
      return [];
    }

    // Convert to MarketListing format
    return (listings || []).map((listing): MarketListing => ({
      id: listing.id,
      price: listing.price,
      mileage: listing.mileage || 0,
      year: listing.year || params.year,
      make: listing.make || params.make,
      model: listing.model || params.model,
      trim: listing.trim || '',
      condition: listing.condition || 'used',
      location: listing.location || '',
      source: listing.source || 'Database',
      sourceType: 'database',
      listingUrl: listing.listing_url || '',
      listing_url: listing.listing_url || '',
      dealerName: listing.dealer_name || '',
      dealer_name: listing.dealer_name || '',
      isCpo: listing.is_cpo || false,
      is_cpo: listing.is_cpo || false,
      fetchedAt: listing.fetched_at || listing.created_at || new Date().toISOString(),
      fetched_at: listing.fetched_at || listing.created_at || new Date().toISOString(),
      confidenceScore: 0.7 // Lower confidence for database data
    }));

  } catch (error) {
    console.error('❌ Database fallback failed:', error);
    return [];
  }
}
