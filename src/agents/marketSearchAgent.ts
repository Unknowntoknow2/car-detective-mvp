// Market Search Agent - Fetches real-time market data via OpenAI Web Search
import { supabase } from "@/integrations/supabase/client";
import { ValuationInput, MarketListing } from "@/types/valuation";
import { parseVehicleListingsFromWeb, type ParsedListing } from "@/utils/parsers/listingParser";

interface ListingComp {
  price: number;
  title: string;
  source: string;
  url: string;
}

interface MarketComps {
  average: number;
  low: number;
  high: number;
  sources: ListingComp[];
}

export async function fetchMarketComps(input: ValuationInput): Promise<MarketListing[]> {
  try {
    console.log('🔍 Market Search Agent: Fetching real-time listings via OpenAI for:', {
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
    }

    if (existingListings && existingListings.length > 0) {
      console.log('📊 Found', existingListings.length, 'existing market listings');
      return existingListings.map(transformToMarketListing);
    }

    // Use OpenAI web search to find live listings with enhanced query
    console.log('🤖 Fetching live market listings via OpenAI web search...');
    
    const query = `Find used ${input.year} ${input.make} ${input.model} ${input.trim || ''} vehicles for sale near ZIP ${input.zipCode}. Include prices, mileage, and source websites like Cars.com, AutoTrader, CarGurus, Edmunds. Focus on listings with ${input.mileage ? `around ${input.mileage.toLocaleString()} miles` : 'similar mileage'}.`;
    
    const { data: searchResult, error: searchError } = await supabase.functions.invoke('openai-web-search', {
      body: { 
        query,
        max_tokens: 3000 // Increased for more detailed responses
      }
    });

    if (searchError) {
      console.error('❌ Error calling OpenAI web search:', searchError);
      return [];
    }

    const content = searchResult?.content || searchResult?.result || '';
    const parsedListings = parseVehicleListingsFromWeb(content);
    const marketListings = parsedListings.map(listing => transformParsedToMarketListing(listing, input));

    console.log('✅ OpenAI market search completed, got', marketListings.length, 'listings');
    return marketListings;

  } catch (error) {
    console.error('❌ Market Search Agent error:', error);
    return [];
  }
}

function transformParsedToMarketListing(listing: ParsedListing, input: ValuationInput): MarketListing {
  return {
    id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source: listing.source || 'OpenAI Web Search',
    source_type: 'marketplace',
    price: listing.price,
    year: input.year,
    make: input.make,
    model: input.model,
    trim: input.trim,
    vin: undefined,
    mileage: listing.mileage,
    condition: undefined,
    dealer_name: undefined,
    location: listing.zipCode || input.zipCode,
    listing_url: listing.url || 'https://openai-search-result',
    is_cpo: false,
    fetched_at: new Date().toISOString(),
    confidence_score: listing.mileage ? 85 : 75 // Higher confidence when mileage is available
  };
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