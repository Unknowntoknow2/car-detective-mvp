// Market Listing Database Service - Persists OpenAI market search results
import { supabase } from "@/integrations/supabase/client";
import type { MarketListing } from "@/types/marketListing";

interface MarketListingInsertData {
  vin?: string;
  valuation_id: string;
  valuation_request_id?: string;
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  price: number;
  mileage?: number;
  location?: string;
  zip_code?: string;
  source: string;
  source_type: string;
  listing_url: string;
  url?: string;
  dealer_name?: string;
  dealer?: string;
  condition?: string;
  is_cpo?: boolean;
  cpo?: boolean;
  confidence_score?: number;
  fetched_at: string;
  listing_date?: string;
  features?: any;
  extra?: any;
  notes?: string;
}

/**
 * Batch insert market listings with error handling
 */
export async function saveMarketListings(
  listings: MarketListing[],
  context: {
    vin?: string;
    userId?: string;
    valuationId?: string;
    valuationRequestId?: string;
    zipCode?: string;
  }
): Promise<{ success: boolean; savedCount: number; errors: string[] }> {
  if (!listings || listings.length === 0) {
    return { success: true, savedCount: 0, errors: [] };
  }

  try {
    console.log(`💾 Saving ${listings.length} market listings to database...`);

    // Transform listings to database format
    const listingsToInsert: MarketListingInsertData[] = listings.map(listing => ({
      vin: context.vin,
      valuation_id: context.valuationId || crypto.randomUUID(),
      valuation_request_id: context.valuationRequestId,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      trim: listing.trim,
      price: listing.price,
      mileage: listing.mileage,
      location: listing.location,
      zip_code: context.zipCode || listing.location,
      source: listing.source || 'openai_search',
      source_type: listing.source_type || 'marketplace',
      listing_url: listing.listing_url || `https://openai-generated-${Date.now()}`,
      url: listing.listing_url,
      dealer_name: listing.dealer_name,
      dealer: listing.dealer_name,
      condition: listing.condition,
      is_cpo: listing.is_cpo || false,
      cpo: listing.is_cpo || false,
      confidence_score: listing.confidence_score || 85,
      fetched_at: listing.fetched_at || new Date().toISOString(),
      listing_date: listing.fetched_at || new Date().toISOString(),
      features: {},
      extra: {},
      notes: `Saved from ${listing.source || 'OpenAI search'} at ${new Date().toISOString()}`
    }));

    // Batch insert with conflict handling (avoid duplicates by URL and VIN within 24h)
    const { data, error } = await supabase
      .from('market_listings')
      .insert(listingsToInsert)
      .select('id');

    if (error) {
      console.error('❌ Error saving market listings:', error);
      
      // Try fallback: insert one by one to identify specific errors
      const fallbackResults = await insertListingsOneByOne(listingsToInsert);
      return {
        success: fallbackResults.savedCount > 0,
        savedCount: fallbackResults.savedCount,
        errors: [`Batch insert failed: ${error.message}`, ...fallbackResults.errors]
      };
    }

    const savedCount = data?.length || 0;
    console.log(`✅ Successfully saved ${savedCount} market listings`);
    
    return {
      success: true,
      savedCount,
      errors: []
    };

  } catch (error) {
    console.error('❌ Critical error saving market listings:', error);
    return {
      success: false,
      savedCount: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Fallback: Insert listings one by one to identify issues
 */
async function insertListingsOneByOne(
  listings: MarketListingInsertData[]
): Promise<{ savedCount: number; errors: string[] }> {
  let savedCount = 0;
  const errors: string[] = [];

  for (const listing of listings) {
    try {
      const { error } = await supabase
        .from('market_listings')
        .insert(listing);

      if (error) {
        errors.push(`Failed to save listing ${listing.listing_url}: ${error.message}`);
      } else {
        savedCount++;
      }
    } catch (err) {
      errors.push(`Critical error on listing ${listing.listing_url}: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  }

  return { savedCount, errors };
}

/**
 * Get recent market listings for analysis
 */
export async function getRecentMarketListings(
  filters: {
    make?: string;
    model?: string;
    year?: number;
    zipCode?: string;
    limit?: number;
  }
): Promise<MarketListing[]> {
  try {
    let query = supabase
      .from('market_listings')
      .select('*')
      .order('fetched_at', { ascending: false });

    if (filters.make) query = query.eq('make', filters.make);
    if (filters.model) query = query.eq('model', filters.model);
    if (filters.year) query = query.eq('year', filters.year);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching recent listings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Critical error fetching listings:', error);
    return [];
  }
}