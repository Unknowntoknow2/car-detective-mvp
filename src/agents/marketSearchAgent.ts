// Market Search Agent - Fetches real-time market data
import { supabase } from "@/integrations/supabase/client";
import { ValuationInput, MarketListing } from "@/types/valuation";

export async function fetchMarketComps(input: ValuationInput): Promise<MarketListing[]> {
  try {
    console.log('🔍 Market Search Agent: Fetching real-time listings for:', {
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      zipCode: input.zipCode
    });

    // First, try to get existing market listings from database
    const { data: existingListings, error } = await supabase
      .from('market_listings')
      .select('*')
      .eq('make', input.make)
      .eq('model', input.model)
      .eq('year', input.year)
      .order('fetched_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching market listings:', error);
      return [];
    }

    if (existingListings && existingListings.length > 0) {
      console.log('📊 Found', existingListings.length, 'existing market listings');
      return existingListings.map(transformToMarketListing);
    }

    // If no existing listings, try to fetch new ones via edge function
    console.log('🚀 Fetching new market listings via edge function...');
    
    const { data: fetchResult, error: fetchError } = await supabase.functions.invoke('fetch-market-listings', {
      body: {
        zipCode: input.zipCode,
        make: input.make,
        model: input.model,
        year: input.year,
        vin: input.vin
      }
    });

    if (fetchError) {
      console.error('❌ Error calling fetch-market-listings function:', fetchError);
      return [];
    }

    console.log('✅ Market search completed, got', fetchResult?.listings?.length || 0, 'listings');
    return fetchResult?.listings || [];

  } catch (error) {
    console.error('❌ Market Search Agent error:', error);
    return [];
  }
}

function transformToMarketListing(dbListing: any): MarketListing {
  return {
    id: dbListing.id,
    source: dbListing.source,
    source_type: dbListing.source_type || 'marketplace',
    price: dbListing.price,
    year: dbListing.year,
    make: dbListing.make,
    model: dbListing.model,
    trim: dbListing.trim,
    vin: dbListing.vin,
    mileage: dbListing.mileage,
    condition: dbListing.condition,
    dealer_name: dbListing.dealer_name,
    location: dbListing.location,
    listing_url: dbListing.listing_url,
    is_cpo: dbListing.is_cpo || false,
    fetched_at: dbListing.fetched_at || new Date().toISOString(),
    confidence_score: dbListing.confidence_score || 85
  };
}