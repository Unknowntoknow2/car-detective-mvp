
import { supabase } from '@/integrations/supabase/client';
import { MarketData, MarketListing, MarketListingInsert } from '@/types/marketListings';

// Define a simple response type to avoid deep inference
interface MarketListingsResponse {
  data: MarketListing[] | null;
  error: any;
}

export const fetchMarketListings = async (make: string, model: string, year: number): Promise<MarketListingsResponse> => {
  const response = await supabase
    .from('market_listings')
    .select('source, price, url')
    .eq('make', make)
    .eq('model', model)
    .eq('year', year)
    .order('created_at', { ascending: false })
    .limit(10);
    
  // Use explicit return with type casting to avoid deep inference
  return {
    data: response.data as MarketListing[] | null,
    error: response.error
  };
};

export const fetchNewListings = async (zipCode: string, make: string, model: string, year: number) => {
  return await supabase.functions.invoke('fetch-market-listings', {
    body: { zipCode, make, model, year }
  });
};

export const storeMarketListings = async (
  marketData: MarketData,
  make: string,
  model: string,
  year: number
) => {
  for (const [source, price] of Object.entries(marketData.averages)) {
    const newListing: MarketListingInsert = {
      source,
      price: Number(price),
      url: marketData.sources[source],
      make,
      model,
      year,
      valuation_id: crypto.randomUUID()
    };
    
    await supabase.from('market_listings').insert(newListing);
  }
};
