
export interface ReportData {
  // Vehicle information
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  condition: string;
  
  // Valuation information
  estimatedValue: number;
  confidenceScore: number;
  basePrice?: number;
  priceRange?: [number, number];
  
  // Location information
  zipCode: string;
  
  // Condition information
  aiCondition: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary?: string;
  };
  
  // Additional information
  adjustments: AdjustmentItem[];
  generatedAt: string;
  
  // Extended properties for corrected valuations
  ainSummary?: string;
  marketConditions?: {
    demand: string;
    supply: string;
    priceDirection: string;
  };

  // Competitor and marketplace data
  competitorPrices?: number[];
  competitorAverage?: number;
  marketplaceListings?: MarketplaceListing[];
  auctionResults?: AuctionResult[];
}

export interface AdjustmentItem {
  factor: string;
  impact: number;
  description: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  price: number;
  platform: string;
  location: string;
  url: string;
  mileage?: number;
  created_at: string;
}

export interface AuctionResult {
  id: string;
  price: string;
  auction_source: string;
  sold_date: string;
  condition_grade?: string;
  location?: string;
}

export interface ReportOptions {
  isPremium?: boolean;
  includeExplanation?: boolean;
  includeFooter?: boolean;
  includeBranding?: boolean;
  includeAIScore?: boolean;
  includeTimestamp?: boolean;
  includePhotoAssessment?: boolean;
  includeAuctionData?: boolean;
  includeCompetitorPricing?: boolean;
  includeAINSummary?: boolean;
  includeForecast?: boolean;
  watermark?: string;
  trackingId?: string;
  ainSummary?: string;
  debugInfo?: string;
  enrichedData?: any;
  marketplaceListings?: MarketplaceListing[];
  footerText?: string;
  notifyDealers?: boolean;
}

export interface SectionParams {
  data: ReportData;
  options: ReportOptions;
  page: any; // PDF page object
  fonts: DocumentFonts;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DocumentFonts {
  regular: any;
  bold: any;
  italic?: any;
}
