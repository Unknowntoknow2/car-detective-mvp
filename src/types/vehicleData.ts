/**
 * 🏆 CANONICAL Vehicle Data Types - Google-Level Unification
 * 
 * This file consolidates ALL vehicle and valuation types from:
 * - src/types/vehicleData.ts
 * - apps/ain-valuation-engine/src/types/ValuationTypes.ts  
 * - src/types/valuation.ts
 * - All legacy type definitions
 * 
 * This is the SINGLE SOURCE OF TRUTH for all vehicle-related data structures.
 */

// ===============================================
// VEHICLE CONDITION & TITLE STATUS CONSTANTS
// ===============================================

/** Vehicle condition constants - supports both legacy and new formats */
export const VehicleCondition = {
  EXCELLENT: 'Excellent', // Canonical format (matches AIN engine)
  GOOD: 'Good',
  FAIR: 'Fair', 
  POOR: 'Poor',
  // Legacy aliases for backward compatibility
  excellent: 'Excellent',
  good: 'Good',
  'very-good': 'Good', // Map very-good to Good
  fair: 'Fair',
  poor: 'Poor',
} as const;

/** Title status constants */
export const TitleStatus = {
  CLEAN: 'Clean',
  SALVAGE: 'Salvage', 
  REBUILT: 'Rebuilt',
  LEMON: 'Lemon',
  FLOOD: 'Flood',
  OTHER: 'Other',
  // Legacy aliases
  clean: 'Clean',
  salvage: 'Salvage',
  rebuilt: 'Rebuilt',
  lemon: 'Lemon',
  lien: 'Clean', // Map lien to clean
  flood: 'Flood',
  manufacturer_buyback: 'Lemon',
  unknown: 'Other',
} as const;

// Modern union types
export type VehicleConditionKey = 'Excellent' | 'Good' | 'Fair' | 'Poor';
export type TitleStatusKey = 'Clean' | 'Salvage' | 'Rebuilt' | 'Lemon' | 'Flood' | 'Other';

// ===============================================
// CORE VEHICLE DATA INTERFACE (CANONICAL)
// ===============================================

/**
 * 🎯 PRIMARY VEHICLE DATA INTERFACE
 * This consolidates VehicleData, VehicleDataCanonical, and all legacy formats
 */
export interface VehicleData {
  // REQUIRED CORE FIELDS (AIN Engine compatible)
  vin?: string; // Optional for manual entry, required for API
  year: number;
  make: string;
  model: string;
  mileage?: number; // Optional for initial entry
  zip?: string; // AIN engine field name
  zipCode?: string; // Legacy field name (mapped to zip)
  condition?: VehicleConditionKey;
  titleStatus?: TitleStatusKey;

  // STRONGLY RECOMMENDED FIELDS  
  trim?: string;
  engine?: string;
  drivetrain?: string;
  fuelType?: string;
  color?: string; // Maps to exteriorColor
  exteriorColor?: string;
  interiorColor?: string;
  lastServiceDate?: string; // ISO format
  accidentHistory?: number | boolean;

  // EXTENDED FIELDS
  transmission?: string;
  bodyType?: string;
  bodyStyle?: string; // Legacy alias
  doors?: string;
  seats?: string;
  displacement?: string;
  engineCylinders?: string;
  
  // ENRICHMENT FIELDS (AIN Engine)
  batteryHealthPercentage?: number;
  photoAiConditionScore?: number;
  marketConfidenceScore?: number;
  sourceOrigin?: string;
  vinDecodeLevel?: 'Basic' | 'Enhanced' | 'Premium';

  // ADVANCED FIELDS (Future expansion)
  auctionHistory?: string;
  serviceHistoryDetails?: string;
  ownershipHistory?: string;
  registrationState?: string;
  insuranceLossRecords?: string;
  aftermarketMods?: string;
  factoryOptions?: string;
  recallStatus?: string;
  tireConditionScore?: number;
  marketSeasonality?: string;
  dealerVsPrivate?: 'Dealer' | 'Private';
  incentivesOrRebates?: string;
  msrpInflationAdjustment?: number;
  fuelPriceAdjustment?: number;
  geoMarketTrends?: string;

  // Extensibility
  [key: string]: any;
}

/**
 * 🚨 LEGACY COMPATIBILITY TYPES - DO NOT USE IN NEW CODE
 * These exist only for backward compatibility during migration
 * @deprecated Use the canonical types above instead
 */
export type VehicleDataCanonical = VehicleData;
export type LegacyVehicleData = VehicleData;
export type DecodedVehicleInfo = VehicleData;
export type Vehicle = VehicleData;

// ===============================================
// VALUATION RESULT INTERFACES (UNIFIED)
// ===============================================

/**
 * Core valuation adjustment interface
 */
export interface ValuationAdjustment {
  factor: string;
  impact: number; // Dollar amount (e.g. +500, -1200)
  description: string;
  label?: string; // Legacy alias
  amount?: number; // Legacy alias (maps to impact)
  reason?: string; // Legacy alias (maps to description)
  name?: string; // Legacy alias
  value?: number; // Legacy value field
  percentAdjustment?: number;
}

/**
 * Market factor for transparency
 */
export interface MarketFactor {
  factor: string;
  impact: number;
  description: string;
}

/**
 * 🎯 PRIMARY VALUATION RESULT INTERFACE
 * This consolidates ALL ValuationResult variants into one canonical interface
 */
export interface ValuationResult {
  // CORE VALUE FIELDS
  estimatedValue: number; // Primary field (AIN engine format)
  value?: number; // Legacy alias (maps to estimatedValue)
  estimated_value?: number; // API format alias
  finalValue?: number; // Legacy alias
  
  // CONFIDENCE & RANGE
  confidence: number; // 0-1 scale
  confidenceScore?: number; // Percentage scale alias (0-100)
  confidence_score?: number; // API format alias
  confidenceLabel?: string;
  
  priceRange?: {
    low: number;
    high: number;
    median?: number;
  };
  
  // ADJUSTMENTS & BREAKDOWN
  adjustments?: ValuationAdjustment[];
  marketFactors?: MarketFactor[];
  breakdown?: {
    base: number;
    mileage: number;
    condition: number;
    market: number;
  };
  baseValue?: number;
  basePrice?: number; // Legacy alias
  
  // VEHICLE DATA
  vehicleData?: VehicleData; // When embedded
  
  // MARKET DATA
  marketListings?: MarketListing[];
  marketValueUSD?: number;
  comp_count?: number;
  listingCount?: number;
  
  // STATUS & METADATA  
  id?: string;
  request_id?: string; // API format
  status?: 'pending' | 'in_progress' | 'completed' | 'failed';
  explanation?: string;
  aiExplanation?: string;
  valuationMethod?: string;
  isUsingFallbackMethod?: boolean;
  isFallbackMethod?: boolean; // Legacy alias
  
  // AUDIT & TRACEABILITY
  sources?: string[];
  sourcesUsed?: string[];
  audit_logs?: AuditLog[];
  
  // LEGACY COMPATIBILITY FIELDS - DO NOT USE IN NEW CODE
  marketSearchStatus?: string;
  isPremium?: boolean;
  createdAt?: string;
  timestamp?: number;
}

// ===============================================
// SUPPORTING INTERFACES
// ===============================================

/**
 * Market listing interface (referenced in ValuationResult)
 */
export interface MarketListing {
  id?: string;
  source: string;
  price: number;
  mileage?: number;
  location?: string;
  url?: string;
  sellerType?: string;
  tier?: string;
  trustWeight?: number;
  title?: string;
  description?: string;
  photos?: string[];
  createdAt?: string;
}

/**
 * Audit log interface
 */
export interface AuditLog {
  id: string;
  action: string;
  message: string;
  created_at: string;
  execution_time_ms?: number;
  raw_data?: Record<string, any>;
}

// ===============================================
// ADDITIONAL DATA STRUCTURES  
// ===============================================

/**
 * Data gap identification for follow-up questions
 */
export interface DataGap {
  field: string;
  importance: 'high' | 'medium' | 'low';
  description: string;
  required?: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

/**
 * Rate limiting information
 */
export interface RateLimit {
  limit: number;
  remaining: number;
  reset: Date;
}

/**
 * VIN decoding result
 */
export interface DecodedVinResult {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  bodyType?: string;
  fuelType?: string;
  drivetrain?: string;
}

/**
 * Session data for tracking user interactions
 */
export interface SessionData {
  id: string;
  vehicleData: VehicleData;
  valuationResult?: ValuationResult;
  timestamp: Date;
}

// ===============================================
// VEHICLE HISTORY INTERFACES
// ===============================================

/**
 * Vehicle history records
 */
export interface AccidentRecord {
  date: Date;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
}

export interface ServiceRecord {
  date: Date;
  type: string;
  mileage: number;
  description: string;
}

export interface OwnershipRecord {
  startDate: Date;
  endDate?: Date;
  ownerType: 'individual' | 'fleet' | 'rental' | 'lease';
}

export interface TitleRecord {
  issueDate: Date;
  status: TitleStatusKey;
  state: string;
}

export interface RecallRecord {
  number: string;
  date: Date;
  description: string;
  status: 'open' | 'closed';
}

export interface VehicleHistory {
  accidents: AccidentRecord[];
  service: ServiceRecord[];
  ownership: OwnershipRecord[];
  title: TitleRecord[];
  recalls: RecallRecord[];
}

// ===============================================
// LEGACY COMPATIBILITY EXPORTS (CONSOLIDATED)
// ===============================================

/**
 * 🚨 LEGACY COMPATIBILITY TYPES - DO NOT USE IN NEW CODE
 * These exist only for backward compatibility during migration
 * @deprecated Use the canonical types above instead
 */

// Request/Response types for API integration
export interface ValuationRequest {
  vin: string;
  vehicleData?: Partial<VehicleData>;
  requestedFeatures?: string[];
}

export interface ValuationApiService {
  requestValuation(request: ValuationRequest): Promise<ValuationResult>;
  getValuationStatus(requestId: string): Promise<{ status: string; result?: ValuationResult }>;
}

export type SourceStatus = 'active' | 'inactive' | 'processing' | 'failed';

// Enhanced valuation types
export interface EnhancedValuationParams {
  vin: string;
  condition?: string;
  mileage?: number;
  zipCode?: string;
  features?: string[];
}

export interface FinalValuationResult extends ValuationResult {
  finalEstimate: number;
  confidence: number;
  recommendations?: string[];
}

export interface ValuationParams {
  vin: string;
  condition: string;
  mileage: number;
  location?: string;
}

// Component result types
export interface UnifiedValuationResult extends Omit<ValuationResult, 'timestamp'> {
  id: string;
  timestamp?: number | string | Date;
  requestId?: string;
  isPremium?: boolean;
}

export interface EnhancedValuationResult extends ValuationResult {
  enhancedFeatures: {
    marketComparison: boolean;
    detailedHistory: boolean;
    priceTrends: boolean;
  };
  premiumData?: any;
}