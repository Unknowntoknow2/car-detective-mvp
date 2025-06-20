
export interface MarketListing {
  id: string;
  valuationId: string;
  price: number;
  source: string;
  url?: string;
  listingDate: string;
  createdAt: string;
}

export interface MarketListingInsert {
  source: string;
  price: number;
  url?: string | null;
  make: string;
  model: string;
  year: number;
  valuation_id: string;
}

export interface MarketListingsResponse {
  data: MarketListing[] | null;
  error: any;
}

export interface MarketData {
  averagePrice: number;
  averages?: Record<string, number>;
  priceRange: {
    min: number;
    max: number;
  };
  listingCount: number;
  daysOnMarket: number;
  sources?: Record<string, string>;
}
