
export interface ReportData {
  estimatedValue: number;
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage?: number;
  condition?: string;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
}

export interface ReportOptions {
  isPremium?: boolean;
  includeAuctionData?: boolean;
  includeCompetitorPricing?: boolean;
  includeAINSummary?: boolean;
  notifyDealers?: boolean;
}

export interface PdfOptions {
  isPremium?: boolean;
  includeExplanation?: boolean;
  marketplaceListings?: any[];
}
