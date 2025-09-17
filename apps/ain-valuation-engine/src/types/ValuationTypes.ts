// src/types/ValuationTypes.ts
// Canonical schema for AIN Valuation Engine (Google-level, 40+ factors)
// All legacy types are deprecated and aliased to canonical.

/**
 * Enumerates the supported vehicle conditions used throughout the UI and services.
 */
export enum VehicleCondition {
  EXCELLENT = 'EXCELLENT',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
}

/**
 * Enumerates the supported vehicle title states.
 */
export enum TitleStatus {
  CLEAN = 'CLEAN',
  SALVAGE = 'SALVAGE',
  REBUILT = 'REBUILT',
  FLOOD = 'FLOOD',
  LEMON = 'LEMON',
  MANUFACTURER_BUYBACK = 'MANUFACTURER_BUYBACK',
  OTHER = 'OTHER',
}

// ---
// 📋 Core Required Fields
// ---
export interface VehicleDataCanonical {
  vin: string; // 1
  year: number; // 2
  make: string; // 3
  model: string; // 4
  mileage: number; // 5
  zip: string; // 6
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor'; // 7
  titleStatus: 'Clean' | 'Salvage' | 'Rebuilt' | 'Other'; // 8

  // ⚡ Strongly Recommended
  trim?: string; // 9
  engine?: string; // 10
  drivetrain?: string; // 11
  fuelType?: string; // 12
  color?: string; // 13
  lastServiceDate?: string; // 14 (ISO)
  accidentHistory?: number | boolean; // 15

  // 🔎 Optional/Enrichment
  batteryHealthPercentage?: number; // 16
  photoAiConditionScore?: number; // 17
  marketConfidenceScore?: number; // 18
  sourceOrigin?: string; // 19
  vinDecodeLevel?: 'Basic' | 'Enhanced' | 'Premium'; // 20

  // 🏁 Advanced/Roadmap
  auctionHistory?: string; // 21
  serviceHistoryDetails?: string; // 22
  ownershipHistory?: string; // 23
  registrationState?: string; // 24
  insuranceLossRecords?: string; // 25
  aftermarketMods?: string; // 26
  factoryOptions?: string; // 27
  recallStatus?: string; // 28
  tireConditionScore?: number; // 29
  marketSeasonality?: string; // 30
  dealerVsPrivate?: 'Dealer' | 'Private'; // 31
  incentivesOrRebates?: string; // 32
  msrpInflationAdjustment?: number; // 33
  fuelPriceAdjustment?: number; // 34
  geoMarketTrends?: string; // 35

  // ---
  // Room for future fields (36-40+)
  [key: string]: any;
}

/**
 * Canonical vehicle data with additional convenience aliases used by the UI.
 */
export interface VehicleData extends Omit<VehicleDataCanonical, 'zip' | 'condition' | 'titleStatus'> {
  vin: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  zip?: string;
  zipCode?: string;
  condition: VehicleCondition | string;
  titleStatus: TitleStatus | string;
  drivetrain?: string;
  driveType?: string;
  transmission?: string;
  fuelType?: string;
  engine?: string;
  engineSize?: string;
  trim?: string;
  color?: string;
  exteriorColor?: string;
  interiorColor?: string;
  body?: string;
  doors?: number;
  [key: string]: unknown;
}

export interface Adjustment {
  factor: string;
  impact: number; // e.g. +500, -1200
  description?: string;
  percentage?: number;
}

export interface MarketFactor {
  factor: string;
  impact: number;
  description?: string;
}

export interface ValuationResultCanonical {
  estimatedValue: number;
  priceRange: { low: number; high: number };
  confidence: number; // 0-1
  adjustments: Adjustment[];
  marketFactors: MarketFactor[];
  vehicleData: VehicleDataCanonical;
  explanation: string;
}

/**
 * Flexible valuation result used across the React app and API layer.
 */
export interface ValuationResult extends Omit<ValuationResultCanonical, 'estimatedValue' | 'priceRange' | 'confidence' | 'vehicleData'> {
  estimatedValue: number | null;
  priceRange: { low: number | null; high: number | null };
  confidence: number | null;
  vehicleData: VehicleData;
  adjustments: Adjustment[];
  marketFactors: MarketFactor[];
  explanation: string;
  timestamp?: number | string | Date;
  enrichment?: {
    vinLookup?: Record<string, unknown> | null;
    marketPricing?: Record<string, unknown> | null;
    residualForecast?: Record<string, unknown> | null;
    [key: string]: unknown;
  };
  accuracy?: {
    comparableCount?: number | null;
    modelConfidence?: number | null;
    averageDeviation?: number | null;
    [key: string]: unknown;
  };
}

/**
 * Validation rule metadata used to drive the follow-up data collection form.
 */
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern';
  message: string;
  value?: number | RegExp;
}

export interface DataGap {
  field: keyof VehicleData | string;
  prompt: string;
  required: boolean;
  defaultValue?: unknown;
  validationRules?: ValidationRule[];
}

export interface RateLimit {
  limit?: number;
  remaining?: number;
  resetTime?: Date;
}

export interface ApiMetadata {
  source?: string;
  timestamp?: Date;
  rateLimit?: RateLimit;
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  metadata?: ApiMetadata;
}

export interface DecodedVinResult {
  Variable: string;
  Value: string | number | null;
  ValueId?: string | number;
  Unit?: string;
}

export interface VehicleFeature {
  name: string;
  value: string | number | boolean;
  category: 'engine' | 'transmission' | 'interior' | 'exterior' | 'safety' | 'technology';
}

export interface ConversationState {
  currentStep?: 'vin_input' | 'feature_collection' | 'valuation' | 'complete';
  vin?: string;
  mileage?: number;
  condition?: string;
  features?: VehicleFeature[];
  decoded?: DecodedVinResult[];
  decodeError?: string;
  valuation?: number;
  vehicleData?: Partial<VehicleData>;
  userInputs?: Record<string, unknown>;
  context?: string[];
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  currency: string;
  language: string;
}

export interface SessionData {
  userId?: string;
  startTime?: string;
  lastActivity?: string;
  conversationState?: ConversationState;
  preferences?: UserPreferences;
  [key: string]: unknown;
}

export interface AccidentRecord {
  date: string;
  severity: 'minor' | 'moderate' | 'severe';
  description?: string;
  damageDescription?: string;
  repairCost?: number;
}

export interface ServiceRecord {
  date: string;
  mileage: number;
  type: 'routine' | 'repair' | 'recall' | 'maintenance' | string;
  description?: string;
  cost?: number;
  dealer?: string;
}

export interface OwnershipRecord {
  startDate: string;
  endDate?: string;
  type: 'personal' | 'commercial' | 'rental' | 'lease';
  state?: string;
}

export interface TitleRecord {
  date: string;
  state: string;
  type?: string;
  status?: string;
  mileage?: number;
}

export interface RecallRecord {
  recallNumber: string;
  date: string;
  description: string;
  status: 'open' | 'completed' | 'not_applicable';
}

export interface VehicleHistory {
  vin: string;
  accidentHistory: AccidentRecord[];
  serviceRecords: ServiceRecord[];
  ownershipHistory: OwnershipRecord[];
  titleHistory: TitleRecord[];
  recallHistory: RecallRecord[];
}

/**
 * @deprecated Use VehicleData instead.
 */
export type LegacyVehicleData = VehicleDataCanonical;
/**
 * @deprecated Use ValuationResult instead.
 */
export type ValuationResultDeprecated = ValuationResultCanonical;
