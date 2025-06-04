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
  
  // Additional vehicle properties
  transmission?: string;
  fuelType?: string;
  explanation?: string;
  isPremium?: boolean;
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
  vin?: string | null;
  updated_at?: string | null;
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
<<<<<<< HEAD
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
=======
  pageSize: "letter" | "a4" | "legal";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  includePageNumbers: boolean;
  includePhotos: boolean;
  includeSimilarVehicles: boolean;
  companyInfo: {
    name: string;
    logo: string | null;
    website: string;
    phone: string;
  };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
  margin: number;
  pageWidth: number;
  startY: number;
  textColor: any;
  primaryColor: any;
}

export interface DocumentFonts {
  regular: any;
  bold: any;
  italic?: any;
}
