
export interface AuctionResult {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  soldDate: string;
  location: string;
  condition: string;
  photos: string[];
  source: string;
}

export interface AuctionInsight {
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  totalSales: number;
  trendDirection: 'up' | 'down' | 'stable';
  confidence: number;
}
