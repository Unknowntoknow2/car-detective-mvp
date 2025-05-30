

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
  mileage: number;
  zipCode: string;
  condition: string;
  estimatedValue: number;
  adjustments: AdjustmentItem[];
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
  explanation?: string;
}

export interface ReportOptions {
  isPremium?: boolean;
  includeExplanation?: boolean;
  includeAuctionData?: boolean;
  includeFooter?: boolean;
  includeBranding?: boolean;
  includeAIScore?: boolean;
  includeTimestamp?: boolean;
  includePhotoAssessment?: boolean;
  footerText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fonts?: {
    titleFont: string;
    bodyFont: string;
  };
  enrichedData?: any;
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

