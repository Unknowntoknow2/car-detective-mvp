// src/agents/marketSearchAgent.ts

import { MarketSearchInput, MarketListing } from "@/types/valuationTypes";
import { supabase } from '@/integrations/supabase/client';

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

export async function searchMarketListings(input: MarketSearchInput): Promise<MarketListing[]> {
  const { make, model, year, trim, zipCode } = input;

  try {
    console.log('🔍 Market Search Agent - Direct DB Query:', { make, model, year, trim, zipCode });

    // Build comprehensive query with enhanced filtering
    let query = supabase
      .from('enhanced_market_listings')
      .select('*')
      .ilike('make', make || '')
      .ilike('model', model || '')
      .eq('year', year)
      .eq('listing_status', 'active')
      .gt('price', 1000)
      .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Apply regional filtering if zipCode provided
    if (zipCode) {
      query = query.or(`zip_code.eq.${zipCode},geo_distance_miles.lte.100,geo_distance_miles.is.null`);
    }

    const { data: listings, error } = await query
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ Error in direct DB query:', error);
      return [];
    }

    let filteredListings = listings || [];

    // Apply trim filtering if specified
    if (trim && filteredListings.length > 0) {
      const trimMatches = filteredListings.filter(l => 
        l.trim && l.trim.toLowerCase().includes(trim.toLowerCase())
      );
      
      if (trimMatches.length >= 2) {
        filteredListings = trimMatches;
        console.log(`✅ Applied trim filter: ${trimMatches.length} matches for "${trim}"`);
      } else {
        console.log(`⚠️ Insufficient trim matches (${trimMatches.length}), using all listings`);
      }
    }

    console.log(`📊 Market Search Agent returning ${filteredListings.length} listings`);

    // Convert to MarketListing format
    return filteredListings.map(listing => ({
      id: listing.id,
      price: listing.price,
      mileage: listing.mileage || 0,
      year: listing.year || year,
      make: listing.make || make,
      model: listing.model || model,
      trim: listing.trim || '',
      condition: listing.condition || 'used',
      location: listing.location || '',
      source: listing.source || 'Unknown',
      source_type: listing.source_type || 'marketplace',
      listing_url: listing.listing_url || '',
      dealer_name: listing.dealer_name || '',
      is_cpo: listing.is_cpo || false,
      fetched_at: listing.fetched_at || listing.created_at || new Date().toISOString(),
      confidence_score: listing.confidence_score || 0.8
    }));

  } catch (error) {
    console.error('❌ Error in market search agent:', error);
    return [];
  }
}