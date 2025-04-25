
import { supabase } from '@/integrations/supabase/client';
import { MarketData, MarketListingInsert } from '@/types/marketListings';

// Define a simplified return type for the fetch operation
type FetchListingsResult = {
  data: {
    source: string;
    price: number;
    url: string | null;
  }[] | null;
  error: Error | null;
}

export const fetchMarketListings = async (make: string, model: string, year: number): Promise<FetchListingsResult> => {
  const response = await supabase
    .from('market_listings')
    .select('source, price, url')
    .eq('make', make)
    .eq('model', model)
    .eq('year', year)
    .order('created_at', { ascending: false })
    .limit(10);
    
  return response;
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
