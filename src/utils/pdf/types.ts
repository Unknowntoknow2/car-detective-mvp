
export interface AuctionResult {
  vin: string;
  auction_source: string;
  price: string;
  sold_date: string;
  odometer: string;
  condition_grade?: string;
  location?: string;
  photo_urls: string[];
}

export interface ReportData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  zipCode: string;
  condition: string;
  estimatedValue: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  generatedAt: string;
  confidenceScore: number;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary: string;
  };
  vin?: string;
  priceRange?: [number, number];
  isPremium?: boolean;
  transmission?: string;
  trim?: string;
  color?: string;
  fuelType?: string;
  bodyStyle?: string;
  photoUrl?: string;
  auctionResults?: AuctionResult[];
}

export interface ReportOptions {
  isPremium?: boolean;
  includeExplanation?: boolean;
  includeAuctionData?: boolean;
  enrichedData?: any;
}
