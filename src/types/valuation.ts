
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
  competitorPrices?: number[];
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
  companyInfo?: {
    name: string;
    logo: string | null;
    website: string;
    phone: string;
  };
}

export interface AICondition {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidence: number;
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
  description: string;
}

// Legacy ValuationResult interface (keeping for backward compatibility)
export interface LegacyValuationResult {
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

// Modern ValuationResult interface (aligned with API service)
export interface ValuationResult {
  request_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  estimated_value?: number;
  confidence_score?: number;
  comp_count: number;
  market_listings: MarketListing[];
  audit_logs: AuditLog[];
  price_range?: {
    low: number;
    high: number;
    median: number;
  };
  source_breakdown?: Record<string, {
    count: number;
    avg_price: number;
  }>;
}

export interface MarketListing {
  id: string;
  source: string;
  source_type: string;
  price: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  vin?: string;
  mileage?: number;
  condition?: string;
  dealer_name?: string;
  location?: string;
  listing_url: string;
  is_cpo: boolean;
  fetched_at: string;
  confidence_score: number;
}

export interface AuditLog {
  id: string;
  action: string;
  message: string;
  created_at: string;
  execution_time_ms?: number;
  raw_data?: Record<string, any>;
}

// Enhanced audit log for valuation traceability
export interface EnhancedAuditLog {
  vin: string;
  valuationId?: string;
  timestamp: string;
  zip: string;
  mileage?: number;
  condition?: string;
  sources: string[];
  quality: number;
  confidence_score: number;
  fallbackUsed: boolean;
  listings?: MarketListing[];
  aiFallback?: any;
  baseMSRP?: number | null;
  msrpSource?: "manufacturer" | "market_api" | "make_fallback" | "missing";
  marketListingsCount?: number;
  marketListingSources?: string[];
  mileageConfidence?: "actual" | "estimated" | "missing";
  zipConfidence?: "valid" | "invalid" | "missing";
  confidenceBreakdown?: {
    vin: boolean;
    zip: boolean;
    actualMileage: boolean;
    msrpEstimated: boolean;
    marketListings: boolean;
  };
  valueBreakdown?: {
    baseValue: number;
    depreciationAdjustment: number;
    mileageAdjustment: number;
    conditionAdjustment: number;
    otherAdjustments: number;
  };
  finalValue?: number;
  sourcesUsed?: string[];
  warnings?: string[];
  followUpCompleted?: boolean;
}

// Valuation input interface
export interface ValuationInput {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  zipCode: string;
  trim?: string;
  color?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
}

// Enhanced valuation result interface
export interface EnhancedValuationResult {
  estimated_value: number;
  base_value_source: string;
  price_range_low?: number;
  price_range_high?: number;
  depreciation?: number;
  mileage_adjustment?: number;
  value_breakdown: ValueBreakdown;
  confidence_score: number;
  valuation_explanation: string;
  audit_id?: string;
}

// Value breakdown for transparency
export interface ValueBreakdown {
  base_value: number;
  depreciation: number;
  mileage_adjustment: number;
  total_adjustments: number;
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
