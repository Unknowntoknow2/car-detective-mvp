
export interface AuctionResult {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: string | number;
  soldDate: string;
  sold_date: string;
  location: string;
  condition: string;
  condition_grade?: string;
  photos: string[];
  photo_urls?: string[];
  source: string;
  auction_source: string;
  odometer?: string;
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
