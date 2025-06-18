
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
  isPremium?: boolean;
  companyInfo: {
    name: string;
    logo: string | null;
    website: string;
    phone: string;
  };
}

export interface SectionParams {
  page: PDFPage;
  margin: number;
  contentWidth: number;
  regularFont: PDFFont;
  boldFont: PDFFont;
  y?: number;
  startY: number;
  width: number;
  pageWidth: number;
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
  };
  data: ReportData;
  textColor: any;
  primaryColor: any;
  secondaryColor: any;
  options: ReportOptions;
}

export interface PdfOptions {
  isPremium?: boolean;
  includeExplanation?: boolean;
  marketplaceListings?: any[];
  includeAuctionData?: boolean;
}

export interface AICondition {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidence: number;
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
  description: string;
}

// Add missing exports that other files are trying to import
export interface ValuationResult {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: AdjustmentBreakdown[];
  basePrice?: number;
  baseValue?: number;
  finalValue?: number;
  features?: string[];
  color?: string;
  bodyStyle?: string;
  bodyType?: string;
  fuelType?: string;
  explanation?: string;
  transmission?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  photoExplanation?: string;
  vin?: string;
  isPremium?: boolean;
  zipCode?: string;
  createdAt?: string;
}

export interface DealerInsights {
  totalOffers: number;
  averageOfferValue: number;
  responseRate: number;
}

export interface SavedValuation {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  confidence_score: number;
  condition_score?: number;
  created_at: string;
  saved_at: string;
  valuationDetails: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    estimatedValue: number;
    confidenceScore: number;
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ValuationPipeline {
  status: 'processing' | 'completed' | 'failed';
  data: any;
}

export interface ModificationDetails {
  hasModifications: boolean;
  types: string[];
  reversible?: boolean;
}
