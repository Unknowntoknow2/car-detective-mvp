// Market Search Agent - Fetches real-time market data via OpenAI Web Search
import { supabase } from "@/integrations/supabase/client";
import { ValuationInput, MarketListing } from "@/types/valuation";

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

    // Use OpenAI web search to find live listings
    console.log('🤖 Fetching live market listings via OpenAI web search...');
    
    const query = `${input.year} ${input.make} ${input.model} ${input.trim || ''} for sale near ${input.zipCode}`;
    
    const { data: searchResult, error: searchError } = await supabase.functions.invoke('openai-web-search', {
      body: { query }
    });

    if (searchError) {
      console.error('❌ Error calling OpenAI web search:', searchError);
      return [];
    }

    const parsedListings = extractListingsFromSearchResult(searchResult?.result || '');
    const marketListings = parsedListings.map(comp => transformCompToMarketListing(comp, input));

    console.log('✅ OpenAI market search completed, got', marketListings.length, 'listings');
    return marketListings;

  } catch (error) {
    console.error('❌ Market Search Agent error:', error);
    return [];
  }
}

function extractListingsFromSearchResult(text: string): ListingComp[] {
  const priceRegex = /\$([\d,]+)[^\n]*?(?:20[0-9]{2})?\s*(?:Toyota|Honda|Ford|Hyundai|Chevy|Kia|BMW|Mercedes|Audi|Lexus|Acura|Infiniti|Cadillac|Lincoln|Buick|GMC|Chevrolet|Nissan|Mazda|Subaru|Volkswagen|Volvo|Jeep|Ram|Dodge|Chrysler)?[^\n]*?(?:Camry|Civic|F-150|Accord|Corolla|Altima|Sentra|Cruze|Malibu|Impala)?/gi;
  const results: ListingComp[] = [];

  for (const match of text.matchAll(priceRegex)) {
    const price = parseInt(match[1].replace(/,/g, ''), 10);
    if (!isNaN(price) && price > 1000 && price < 200000) {
      const title = match[0].slice(0, 80).trim();
      results.push({
        price,
        title,
        source: 'OpenAI Web Search',
        url: ''
      });
    }
  }

  return results.slice(0, 10); // Limit to 10 results
}

function transformCompToMarketListing(comp: ListingComp, input: ValuationInput): MarketListing {
  return {
    id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source: comp.source,
    source_type: 'marketplace',
    price: comp.price,
    year: input.year,
    make: input.make,
    model: input.model,
    trim: input.trim,
    vin: undefined,
    mileage: undefined,
    condition: undefined,
    dealer_name: undefined,
    location: input.zipCode,
    listing_url: comp.url || 'https://openai-search-result',
    is_cpo: false,
    fetched_at: new Date().toISOString(),
    confidence_score: 75 // Lower confidence for AI-parsed listings
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