
export type IdentifierType = 'vin' | 'plate';

export type Stage = 
  | 'initial' 
  | 'lookup_in_progress' 
  | 'lookup_failed' 
  | 'vehicle_found' 
  | 'details_required' 
  | 'valuation_in_progress' 
  | 'valuation_complete' 
  | 'valuation_failed';

export interface Vehicle {
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
}

export interface RequiredInputs {
  mileage: number | null;
  fuelType: string | null;
  zipCode: string;
  condition?: number;
  conditionLabel?: string;
  hasAccident?: boolean;
  accidentDescription?: string;
}

export interface ValuationResult {
  id: string;
  estimated_value: number;
  confidence_score: number;
  price_range?: [number, number];
  base_price?: number;
  zip_demand_factor?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export interface ValuationPipelineState {
  stage: Stage;
  vehicle: Vehicle | null;
  requiredInputs: RequiredInputs | null;
  valuationResult: ValuationResult | null;
  error: string | null;
  isLoading: boolean;
}

export interface ValuationPipelineActions {
  runLookup: (type: IdentifierType, identifier: string, state?: string) => Promise<boolean>;
  submitValuation: (details: Partial<RequiredInputs>) => Promise<boolean>;
  reset: () => void;
}

export type ValuationPipeline = ValuationPipelineState & ValuationPipelineActions;
