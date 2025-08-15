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

export { MarketListing } from './marketListing';

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
  fuelType?: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission?: string;
  ownership?: number; // Number of previous owners
  usageType?: string; // "personal" | "rental" | "fleet" | "commercial"
  mpg?: number; // Vehicle fuel economy
}

// Unified valuation result interface
export interface UnifiedValuationResult {
  id: string;
  vin?: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    fuelType?: string;
  };
  zip: string;
  mileage?: number;
  baseValue: number;
  adjustments: ValuationAdjustment[];
  finalValue: number;
  confidenceScore: number;
  aiExplanation?: string;
  sources: string[];
  listingRange?: any;
  listingCount: number;
  listings: MarketListing[];
  marketSearchStatus?: string;
  timestamp: number;
  // NEW ENGINE FEATURES FROM valuationEngine.ts
  priceRange?: [number, number];
  zipAdjustment?: number;
  mileageAdjustment?: number;
  mileagePenalty?: number;
  conditionAdjustment?: number;
  conditionDelta?: number;
  titlePenalty?: number;
  sourcesUsed?: string[];
  // TIER-AWARE MARKET INTELLIGENCE FIELDS
  marketAnchoredPrice?: number | null;
  marketListings?: {
    price: number;
    mileage: number;
    source: string;
    tier: string;
    trustWeight: number;
    location?: string;
    url?: string;
    sellerType?: string;
  }[];
  sourceBreakdown?: {
    tier1: number;
    tier2: number;
    tier3: number;
    retail: number;
    p2p: number;
    auction: number;
    urls: string[];
  };
  // ENHANCED: Dealer Source Contributions for Transparency  
  sourceContributions?: Array<{
    source: string;
    tier: 'Tier1' | 'Tier2' | 'Tier3';
    trustWeight: number;
    listingsUsed: number;
    avgPrice: number;
    domain: string;
  }>;
  // Title and Recall Intelligence
  titleStatus?: 'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'theft_recovery' | 'unknown';
  titleHistory?: TitleHistoryResult | null;
  openRecalls?: RecallEntry[];
  recallCheck?: RecallCheckResult | null;
  recalls?: string[]; // Simple string array for easy UI display
  notes: string[];
  titleRecallInfo?: {
    titleStatus: 'Clean' | 'Salvage' | 'Rebuilt' | 'Lemon' | 'Flood' | 'Stolen' | 'Unknown';
    brandedDetails?: string;
    recalls: {
      id: string;
      component: string;
      summary: string;
      riskLevel: 'Critical' | 'Important' | 'Informational';
      recallDate: string;
      resolved?: boolean;
    }[];
    oemRepairLinks?: string[];
    lastChecked: string;
  };
}

export interface ValuationAdjustment {
  label: string;
  amount: number;
  reason: string;
}

import { MarketListing } from '@/types/marketListing';

// Enhanced valuation result interface
export interface EnhancedValuationResult {
  id?: string;
  estimatedValue: number;
  estimated_value?: number;  // Backward compatibility
  priceRange?: [number, number];
  confidenceScore: number;
  confidence_score?: number;  // Backward compatibility
  confidenceLabel?: string;
  valuationMethod?: string;
  isUsingFallbackMethod?: boolean;
  isFallbackMethod?: boolean;  // Backward compatibility
  
  // Market data
  marketListings?: MarketListing[];
  marketSearchStatus?: string;
  sources?: string[];  // Backward compatibility
  
  // Adjustments
  adjustments?: ValuationAdjustment[];
  baseValue?: number;
  
  // Backward compatibility fields
  base_value_source?: string;
  value_breakdown?: any;
  explanation?: string;
  mileage_adjustment?: number;
  valuation_explanation?: string;
  vin?: string;
  depreciation?: number;
  marketIntelligence?: any;
  auditTrail?: any;
  
  // Process audit trail (if enabled)
  processAuditTrail?: {
    includedListings: number;
    excludedListings: number;
    exclusionReasons: Array<{ source: string; url: string; reason: string }>;
    processStages: any;
    valuationId: string;
    error?: string;
  };

  // Vehicle info
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
}

// Value breakdown for transparency
export interface ValueBreakdown {
  base_value: number;
  total_adjustments: number;
  depreciation: number;
  mileage: number;
  condition: number;
  ownership: number;
  usageType: number;
  marketSignal: number;
  fuelCost: number;
  fuelType: number;
  marketComps: number;
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

// Title and Recall Intelligence Types
export type TitleStatus = 'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'theft_recovery';

export interface RecallEntry {
  id: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issuedDate: string;
  isResolved: boolean;
  component?: string;
  consequence?: string;
}

export interface TitleHistoryResult {
  status: TitleStatus;
  confidence: number;
  source: 'nicb' | 'dmv' | 'insurance_auction' | 'carfax';
  lastChecked: string;
  details?: {
    damageTypes?: string[];
    totalLossDate?: string;
    rebuildDate?: string;
  };
}

export interface RecallCheckResult {
  recalls: RecallEntry[];
  unresolved: RecallEntry[];
  totalRecalls: number;
  unresolvedCount: number;
  lastChecked: string;
  source: 'nhtsa' | 'manufacturer';
}
