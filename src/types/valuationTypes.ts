// Market search types for the OpenAI agent
export interface MarketSearchInput {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  zip?: string;
  zipCode?: string; // Alternative name for zip
}

export interface MarketListing {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  price: number;
  condition?: string;
  zip?: string;
  location?: string;
  source: string;
  titleStatus?: string;
  photos?: string[];
  link?: string;
}