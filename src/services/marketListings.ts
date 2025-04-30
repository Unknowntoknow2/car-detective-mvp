
import { supabase } from '@/integrations/supabase/client';
import { MarketData, MarketListing, MarketListingInsert, MarketListingsResponse } from '@/types/marketListings';

/**
 * Fetch the last 10 market listings for a given make/model/year.
 * We use `any` to stop TS from inferring your entire DB schema.
 */
export const fetchMarketListings = async (
  make: string, 
  model: string, 
  year: number
): Promise<MarketListingsResponse> => {
  const { data, error } = await (supabase.from('market_listings') as any)
    .select('source, price, url')
    .eq('make', make)
    .eq('model', model)
    .eq('year', year)
    .order('created_at', { ascending: false })
    .limit(10);
    
  return {
    data: data as MarketListing[] | null,
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
  
  // Using any to prevent type inference issues
  await (supabase.from('market_listings') as any).insert(inserts);
};
