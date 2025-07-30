// Core types for the valuation engine

export interface VehicleData {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  zipCode?: string;
  condition?: VehicleCondition;
  titleStatus?: TitleStatus;
  exteriorColor?: string;
  interiorColor?: string;
  transmission?: string;
  fuelType?: string;
  drivetrain?: string;
  engineSize?: string;
}

export enum VehicleCondition {
  EXCELLENT = 'excellent',
  VERY_GOOD = 'very_good', 
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export enum TitleStatus {
  CLEAN = 'clean',
  SALVAGE = 'salvage',
  REBUILT = 'rebuilt',
  FLOOD = 'flood',
  LEMON = 'lemon',
  MANUFACTURER_BUYBACK = 'manufacturer_buyback'
}

export interface MarketListing {
  id: string;
  price: number;
  mileage: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  condition: VehicleCondition;
  location: string;
  source: string;
  listingDate: Date;
  url?: string;
  dealer?: boolean;
  certification?: string;
}

export interface VehicleHistory {
  vin: string;
  accidentHistory: AccidentRecord[];
  serviceRecords: ServiceRecord[];
  ownershipHistory: OwnershipRecord[];
  titleHistory: TitleRecord[];
  recallsHistory: RecallRecord[];
}

export interface AccidentRecord {
  date: Date;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  damageAmount?: number;
}

export interface ServiceRecord {
  date: Date;
  mileage: number;
  serviceType: string;
  description: string;
  cost?: number;
  dealer: boolean;
}

export interface OwnershipRecord {
  startDate: Date;
  endDate?: Date;
  ownerType: 'personal' | 'fleet' | 'rental' | 'lease';
  state: string;
}

export interface TitleRecord {
  date: Date;
  state: string;
  titleType: TitleStatus;
  mileage?: number;
}

export interface RecallRecord {
  recallNumber: string;
  date: Date;
  description: string;
  status: 'open' | 'completed' | 'remedy_not_available';
}

export interface AuctionResult {
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: VehicleCondition;
  salePrice: number;
  saleDate: Date;
  auctionHouse: string;
  location: string;
  grade?: string;
}

export interface PricingHistory {
  make: string;
  model: string;
  year: number;
  trim?: string;
  msrp: number;
  historicalPrices: PricePoint[];
  depreciation: DepreciationData[];
}

export interface PricePoint {
  date: Date;
  price: number;
  source: string;
  priceType: 'msrp' | 'invoice' | 'market_average' | 'auction_average';
}

export interface DepreciationData {
  ageInMonths: number;
  retentionPercentage: number;
  averageMarketValue: number;
}

export interface MarketDemand {
  make: string;
  model: string;
  year: number;
  region: string;
  demandScore: number; // 0-100
  inventoryLevel: 'low' | 'normal' | 'high';
  daysOnMarket: number;
  priceMovement: 'increasing' | 'stable' | 'decreasing';
  seasonalFactors: SeasonalFactor[];
}

export interface SeasonalFactor {
  month: number;
  demandMultiplier: number;
  priceMultiplier: number;
}

export interface ValuationResult {
  vehicleData: VehicleData;
  estimatedValue: number;
  confidence: number; // 0-100
  priceRange: {
    low: number;
    high: number;
  };
  comparables: MarketListing[];
  adjustments: ValuationAdjustment[];
  marketFactors: MarketFactor[];
  explanation: string;
  accuracy: AccuracyMetrics;
  timestamp: Date;
}

export interface ValuationAdjustment {
  factor: string;
  adjustment: number;
  percentage: number;
  explanation: string;
}

export interface MarketFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface AccuracyMetrics {
  comparableCount: number;
  dataQuality: number; // 0-100
  marketCoverage: number; // 0-100
  confidenceInterval: number;
  benchmarkAccuracy?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    source: string;
    timestamp: Date;
    rateLimit?: RateLimit;
  };
}

export interface RateLimit {
  remaining: number;
  resetTime: Date;
  limit: number;
}

export interface DataGap {
  field: string;
  required: boolean;
  defaultValue?: any;
  prompt: string;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}