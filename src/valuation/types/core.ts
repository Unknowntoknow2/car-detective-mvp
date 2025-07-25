/**
 * Core types for the enhanced valuation engine
 * ML/AI-ready with comprehensive data structures
 */

export interface ValuationInput {
  // Vehicle identification
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType?: string;
  
  // Vehicle state
  mileage: number;
  condition: 'excellent' | 'very_good' | 'good' | 'fair' | 'poor';
  
  // Location context
  zipCode: string;
  searchRadius?: number; // miles
  
  // Optional enhanced data
  photos?: VehiclePhoto[];
  serviceHistory?: ServiceRecord[];
  accidentHistory?: AccidentRecord[];
  modifications?: Modification[];
  additionalFactors?: AdditionalFactor[];
  
  // User preferences
  urgency?: 'immediate' | 'normal' | 'patient';
  saleType?: 'dealer' | 'private' | 'trade_in' | 'auction';
}

export interface VehiclePhoto {
  id: string;
  url: string;
  category: 'exterior' | 'interior' | 'engine' | 'damage' | 'other';
  aiScore?: number;
  damageDetected?: DamageDetection[];
  uploadedAt: string;
}

export interface DamageDetection {
  type: 'dent' | 'scratch' | 'rust' | 'crack' | 'wear';
  severity: 'minor' | 'moderate' | 'major';
  location: string;
  confidence: number;
}

export interface ServiceRecord {
  date: string;
  mileage: number;
  serviceType: string;
  cost?: number;
  provider?: string;
  verified: boolean;
}

export interface AccidentRecord {
  date: string;
  severity: 'minor' | 'moderate' | 'major' | 'total_loss';
  damageDescription?: string;
  repairCost?: number;
  verified: boolean;
}

export interface Modification {
  type: string;
  description: string;
  cost?: number;
  professional: boolean;
  impactOnValue?: 'positive' | 'negative' | 'neutral';
}

export interface AdditionalFactor {
  factor: string;
  value: any;
  impact?: 'positive' | 'negative' | 'neutral';
}

export interface ValuationResult {
  // Basic result
  id: string;
  estimatedValue: number;
  priceRange: [number, number];
  confidenceScore: number; // 0-100
  valuationMethod: string;
  
  // Detailed breakdown
  baseValuation: BaseValuation;
  adjustments: PriceAdjustment[];
  marketInsights: MarketInsights;
  confidenceBreakdown: ConfidenceBreakdown;
  
  // Metadata
  metadata: ValuationMetadata;
}

export interface BaseValuation {
  value: number;
  source: 'ML_MODEL' | 'MARKET_DATA' | 'MSRP' | 'HYBRID';
  confidence: number;
  dataPointsUsed?: number;
}

export interface PriceAdjustment {
  factor: string;
  impact: number; // dollar amount
  percentage?: number;
  description: string;
  confidence: number;
  category: 'condition' | 'mileage' | 'market' | 'location' | 'features' | 'history';
}

export interface MarketInsights {
  avgMarketplacePrice: number;
  listingCount: number;
  priceVariance: number;
  demandIndex: number; // 0-100, higher = more demand
  timeOnMarket: number; // average days
  competitivePosition: 'below_market' | 'at_market' | 'above_market';
  priceRecommendation?: string;
}

export interface ConfidenceBreakdown {
  dataQuality: number; // 0-100
  marketDataAvailability: number; // 0-100
  vehicleDataCompleteness: number; // 0-100
  mlModelConfidence: number; // 0-100
  overallConfidence: number; // 0-100
  factors: ConfidenceFactor[];
  recommendations: string[];
}

export interface ConfidenceFactor {
  factor: string;
  score: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

export interface ValuationMetadata {
  timestamp: string;
  processingTimeMs: number;
  version: string;
  dataSourcesUsed: string[];
  debugInfo?: any;
}

export interface ValuationContext {
  startTime: number;
  input: ValuationInput;
  debug: boolean;
  requestId?: string;
  userId?: string;
}

// Market Data Types
export interface MarketDataRequest {
  vin: string;
  make: string;
  model: string;
  year: number;
  zipCode: string;
  radius: number;
  trim?: string;
}

export interface MarketDataResponse {
  localListings: MarketListing[];
  nationalAverage: number;
  historicalPrices: HistoricalPrice[];
  seasonalTrends: SeasonalTrend[];
  demandIndex: number;
  averagePrice: number;
  totalListings: number;
  priceVariance: number;
  averageTimeOnMarket: number;
  quality: number; // 0-1
  availability: number; // 0-1
  sourcesUsed: string[];
}

export interface MarketListing {
  id: string;
  price: number;
  mileage: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  condition?: string;
  location: string;
  source: string;
  url?: string;
  listedDate: string;
  features?: string[];
  dealer?: boolean;
  certified?: boolean;
}

export interface HistoricalPrice {
  date: string;
  price: number;
  mileage: number;
  source: string;
}

export interface SeasonalTrend {
  month: number;
  multiplier: number; // relative to annual average
  confidence: number;
}

// ML Model Types
export interface MLPredictionInput {
  vehicleData: ValuationInput;
  marketData: MarketDataResponse;
  historicalData: HistoricalPrice[];
}

export interface MLPredictionResult {
  value: number;
  confidence: number;
  features: MLFeature[];
  modelVersion: string;
}

export interface MLFeature {
  name: string;
  value: number;
  importance: number;
}

// Analysis Types
export interface ConditionAnalysisInput {
  condition: string;
  photos?: VehiclePhoto[];
  serviceHistory?: ServiceRecord[];
  accidentHistory?: AccidentRecord[];
}

export interface ConditionAnalysisResult {
  score: number; // 0-100
  adjustmentFactor: number; // multiplier
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export interface MileageAnalysisInput {
  mileage: number;
  year: number;
  vehicleType?: string;
}

export interface MileageAnalysisResult {
  score: number; // 0-100
  adjustmentFactor: number;
  confidence: number;
  category: 'low' | 'average' | 'high' | 'very_high';
  expectedMileage: number;
}

export interface MarketAnalysisInput {
  localMarket: MarketListing[];
  nationalMarket: number;
  seasonality: SeasonalTrend[];
  demand: number;
}

export interface MarketAnalysisResult {
  adjustmentFactor: number;
  confidence: number;
  insights: string[];
  competitivePosition: string;
}