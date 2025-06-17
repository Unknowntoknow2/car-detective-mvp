
import { PDFFont, PDFPage, rgb } from 'pdf-lib';

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
  priceRange?: [number, number];
  confidenceScore: number;
  zipCode: string;
  adjustments: AdjustmentBreakdown[];
  generatedAt: string;
  isPremium?: boolean;
  aiCondition?: AIConditionResult;
  color?: string;
  bodyType?: string;
  bodyStyle?: string;
  fuelType?: string;
  basePrice?: number;
  competitorPrices?: any[];
  competitorAverage?: number;
  marketplaceListings?: any[];
  auctionResults?: any[];
}

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  name?: string;
  value?: number;
  description: string;
  percentAdjustment?: number;
}

export interface AIConditionResult {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
}

export interface ReportOptions {
  pageSize: string;
  margins: { top: number; right: number; bottom: number; left: number };
  includePageNumbers: boolean;
  includePhotos: boolean;
  includeSimilarVehicles: boolean;
  companyInfo: {
    name: string;
    logo: string | null;
    website: string;
    phone: string;
  };
}

// Add missing SectionParams interface
export interface SectionParams {
  page: PDFPage;
  margin: number;
  contentWidth: number;
  regularFont: PDFFont;
  boldFont: PDFFont;
}

// Add PdfOptions interface for upload function
export interface PdfOptions {
  isPremium?: boolean;
  includeExplanation?: boolean;
  marketplaceListings?: any[];
  includeAuctionData?: boolean;
}
