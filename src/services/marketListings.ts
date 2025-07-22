
import { supabase } from "@/integrations/supabase/client";
import { MarketListing } from "@/types/marketListing";

// Legacy types for backwards compatibility
interface MarketListingInsert {
  source: string;
  price: number;
  url: string | null;
  make: string;
  model: string;
  year: number;
  valuation_id: string;
}

interface MarketListingsResponse {
  data: MarketListing[] | null;
  error: any;
}

interface MarketData {
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  listingCount: number;
  daysOnMarket: number;
  averages?: Record<string, number>;
  sources?: Record<string, string>;
}

/**
 * Fetch the last 10 market listings for a given make/model/year.
 * We use `any` to stop TS from inferring your entire DB schema.
 */
export const fetchMarketListings = async (
  make: string,
  model: string,
  year: number,
): Promise<MarketListingsResponse> => {
  const { data, error } = await (supabase.from("market_listings") as any)
    .select("source, price, url")
    .eq("make", make)
    .eq("model", model)
    .eq("year", year)
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    data: data as MarketListing[] | null,
    error,
  };
};

export const fetchNewListings = async (
  zipCode: string,
  make: string,
  model: string,
  year: number,
) => {
  return await supabase.functions.invoke("fetch-market-listings", {
    body: { zipCode, make, model, year },
  });
};

export const storeMarketListings = async (
  marketData: MarketData,
  make: string,
  model: string,
  year: number,
) => {
  // Check if marketData has averages property and handle safely
  if (!marketData.averages) {
    console.warn('No averages data provided for market listings');
    return;
  }

  const inserts: MarketListingInsert[] = Object.entries(marketData.averages)
    .map(
      ([source, price]) => ({
        source,
        price: Number(price),
        url: marketData.sources?.[source] ?? null,
        make,
        model,
        year,
        valuation_id: crypto.randomUUID(),
      }),
    );

  // Using any to prevent type inference issues
  await (supabase.from("market_listings") as any).insert(inserts);
};
