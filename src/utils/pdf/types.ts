
export interface ReportData {
  id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage: number;
  condition: string;
  estimatedValue: number;
  price: number;
  priceRange: [number, number];
  confidenceScore: number;
  zipCode: string;
  adjustments: any[];
  generatedAt: string;
  isPremium: boolean;
  color?: string;
  bodyType?: string;
  fuelType?: string;
  basePrice?: number;
  competitorPrices?: number[];
  competitorAverage?: number;
  marketplaceListings?: any[];
  auctionResults?: any[];
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    aiSummary: string;
  };
}

export interface PdfOptions {
  isPremium?: boolean;
  includeExplanation?: boolean;
  marketplaceListings?: any[];
}

export interface ReportOptions {
  includePhotos?: boolean;
  includeMarketData?: boolean;
  includeAuctionData?: boolean;
  format?: 'standard' | 'detailed';
}

export interface SectionParams {
  data: ReportData;
  options: PdfOptions;
}
