
export interface MarketData {
  averages: Record<string, number>;
  sources: Record<string, string>;
}

export interface MarketListing {
  source: string;
  price: number;
  url: string | null;
}

export interface MarketListingInsert extends MarketListing {
  valuation_id: string;
  make: string | null;
  model: string | null;
  year: number | null;
}

export interface MarketListingsResponse {
  data: MarketListing[] | null;
  error: any;
}
