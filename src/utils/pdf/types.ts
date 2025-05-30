
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

export interface AdjustmentItem {
  factor: string;
  impact: number;
  description?: string;
}

export interface ReportData {
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  zipCode: string;
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  generatedAt: string;
  
  // Added missing properties
  priceRange?: [number, number];
  basePrice?: number;
  explanation?: string;
  isPremium?: boolean;
  
  // Optional enhanced data
  transmission?: string;
  trim?: string;
  color?: string;
  fuelType?: string;
  bodyStyle?: string;
  photoUrl?: string;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary?: string;
  };
  
  // Auction data
  auctionResults?: Array<{
    price: string;
    sold_date: string;
    auction_source: string;
    condition_grade?: string;
    location?: string;
    odometer?: string;
    photo_urls?: string[];
  }>;
  
  // Competitor pricing data
  competitorPrices?: {
    vin: string;
    carvana_value?: string;
    carmax_value?: string;
    edmunds_value?: string;
    carfax_value?: string;
    carsdotcom_value?: string;
    autotrader_value?: string;
    fetched_at: string;
  };
  competitorAverage?: number;
}

export interface ReportOptions {
  isPremium?: boolean;
  includeBranding?: boolean;
  includeAIScore?: boolean;
  includeFooter?: boolean;
  includeTimestamp?: boolean;
  includePhotoAssessment?: boolean;
  includeAuctionData?: boolean;
  includeCompetitorPricing?: boolean;
  includeAINSummary?: boolean;
  includeDebugInfo?: boolean;
  includeExplanation?: boolean;
  ainSummary?: string;
  debugInfo?: string;
  footerText?: string;
  trackingId?: string;
  
  // PDF styling options
  colorScheme?: 'light' | 'dark' | 'branded';
  logoUrl?: string;
  watermark?: string;
  customHeader?: string;
  customFooter?: string;
}

export interface DocumentFonts {
  regular: any;
  bold: any;
  italic?: any;
}

export interface SectionParams {
  page: any;
  fonts: DocumentFonts;
  data: ReportData;
  options: ReportOptions;
  margin: number;
  width: number;
  pageWidth: number;
  startY: number;
  y?: number;
  textColor?: any;
  primaryColor?: any;
}
