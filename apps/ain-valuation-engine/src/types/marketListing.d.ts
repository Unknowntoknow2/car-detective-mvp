// TypeScript module declaration for canonical MarketListing type
export interface MarketListing {
  id: string;
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price: number;
  mileage?: number;
  dealer?: string;
  source: 'Cars.com' | 'CarGurus' | 'Carvana' | 'Edmunds' | 'Craigslist' | 'eBay Motors' | 'EchoPark' | 'Other';
  url: string;
  location?: string;
  zip?: string;
  fetchedAt?: string;
  listedAt?: string;
  trust_score?: number;
}
