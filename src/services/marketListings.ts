
import { supabase } from '@/integrations/supabase/client';
import { MarketData, MarketListing, MarketListingInsert, MarketListingsResponse } from '@/types/marketListings';

export const fetchMarketListings = async (
  make: string, 
  model: string, 
  year: number
): Promise<MarketListingsResponse> => {
  const { data, error } = await supabase
    .from<MarketListing>('market_listings')
    .select('source, price, url')
    .eq('make', make)
    .eq('model', model)
    .eq('year', year)
    .order('created_at', { ascending: false })
    .limit(10);
    
  return {
    data: data ?? null,
    error
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
  const inserts: MarketListingInsert[] = Object.entries(marketData.averages).map(
    ([source, price]) => ({
      source,
      price: Number(price),
      url: marketData.sources[source] ?? null,
      make,
      model,
      year,
      valuation_id: crypto.randomUUID()
    })
  );
  
  await supabase.from<MarketListingInsert>('market_listings').insert(inserts);
};

