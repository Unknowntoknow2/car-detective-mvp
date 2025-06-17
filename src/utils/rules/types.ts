
// Basic type definitions for the rules engine

export interface RulesEngineInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  trim?: string;
  fuelType?: string;
  transmissionType?: string;
  accidentCount?: number;
  exteriorColor?: string;
  features?: string[];
  aiConditionOverride?: any;
  photoScore?: number;
  basePrice?: number;
  bodyType?: string;
  bodyStyle?: string;
  colorMultiplier?: number;
  baseValue?: number;
  drivingScore?: number;
}

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description: string;
  name?: string;
  value?: number;
  percentAdjustment?: number;
}

// Add missing types for rules engine
export interface ValuationData {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  zipCode: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
  accidentCount?: number;
  color?: string;
  features?: string[];
  photoScore?: number;
  basePrice?: number;
  carfax?: {
    cleanTitle: boolean;
    accidentCount: number;
    serviceRecords: number;
  };
  warranty?: {
    factory?: { active: boolean; monthsRemaining?: number };
    powertrain?: { active: boolean; monthsRemaining?: number };
    extended?: { active: boolean };
  };
  recalls?: Array<{
    severity: 'high' | 'low';
    completed: boolean;
  }>;
}

export interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}

export interface AdjustmentCalculator {
  calculate(
    input: RulesEngineInput,
  ): Promise<AdjustmentBreakdown | null> | AdjustmentBreakdown | null;
}

// Add Calculator interface
export interface Calculator {
  name: string;
  description: string;
  calculate(data: ValuationData): Adjustment | null;
}
