export type AdjustmentSource = 
  | 'market_analysis'
  | 'depreciation_curve_engine' 
  | 'mileage_deviation_calculator'
  | 'condition_assessment'
  | 'regional_market_data'
  | 'openai_estimate'
  | 'user_reported_factor'
  | 'synthetic_default'
  | 'title_status_lookup';

export interface ValidatedAdjustment {
  factor: string;
  amount: number;
  description: string;
  source: AdjustmentSource;
  synthetic: boolean;
  confidence: number; // 0-100 confidence in this adjustment
  calculatedAt: string; // ISO timestamp
  metadata?: Record<string, any>; // Additional context about the calculation
}

export interface AdjustmentCalculationContext {
  vehicleMileage?: number;
  marketAverageMileage?: number;
  condition?: string;
  titleStatus?: string;
  zipCode?: string;
  marketListings: any[];
  baseValue: number;
}

export interface AdjustmentCalculationResult {
  adjustments: ValidatedAdjustment[];
  totalAdjustment: number;
  confidencePenalty: number; // 0-100 points to subtract from overall confidence
  fallbackExplanation?: string;
  calculationNotes: string[];
}