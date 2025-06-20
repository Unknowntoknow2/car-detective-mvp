
export interface MarketListing {
  id: string;
  valuationId: string;
  price: number;
  source: string;
  url?: string;
  listingDate: string;
  createdAt: string;
}

export interface MarketData {
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  listingCount: number;
  daysOnMarket: number;
}
