
export interface MarketplaceListing {
  source: string;
  title: string;
  price: number;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  location: string;
  url: string;
  imageUrl?: string;
  postedDate: string;
  condition?: string;
  description?: string;
  sellerType?: 'dealer' | 'private' | 'unknown';
}

export interface ScraperConfig {
  maxResults: number;
  timeout: number;
  retries: number;
}

export interface ScraperResult {
  success: boolean;
  listings: MarketplaceListing[];
  error?: string;
  source: string;
  searchParams: {
    make?: string;
    model?: string;
    year?: number;
    zipCode?: string;
  };
}
