
// src/types/ValuationTypes.ts
// Canonical schema for AIN Valuation Engine (Google-level, 40+ factors)
// All legacy types are deprecated and aliased to canonical.

import type {
  TitleStatusLiteral,
  VehicleConditionLiteral,
  VehicleData,
  VehicleDataCanonical,
} from './canonical'

export type { VehicleData, VehicleDataCanonical } from './canonical'
export { toCanonicalVehicleData } from './canonical'

/**
 * @deprecated Use VehicleDataCanonical instead.
 */
export type LegacyVehicleData = VehicleDataCanonical
/**
 * @deprecated Use ValuationResultCanonical instead.
 */
export type ValuationResult = ValuationResultCanonical

/**
 * Runtime-friendly vehicle condition options used throughout the valuation UI.
 */
export const VehicleCondition = {
  EXCELLENT: 'excellent',
  VERY_GOOD: 'very_good',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
} as const satisfies Record<string, VehicleConditionLiteral>

export type VehicleCondition = (typeof VehicleCondition)[keyof typeof VehicleCondition]

/**
 * Canonical title status values for valuation workflows.
 */
export const TitleStatus = {
  CLEAN: 'clean',
  SALVAGE: 'salvage',
  REBUILT: 'rebuilt',
  FLOOD: 'flood',
  LEMON: 'lemon',
  MANUFACTURER_BUYBACK: 'manufacturer_buyback',
  UNKNOWN: 'unknown',
} as const satisfies Record<string, TitleStatusLiteral>

export type TitleStatus = (typeof TitleStatus)[keyof typeof TitleStatus]

/**
 * Validation rule definition for data collection prompts.
 */
export type ValidationRule =
  | { type: 'required'; message: string }
  | { type: 'min' | 'max'; message: string; value: number }
  | { type: 'pattern'; message: string; value: RegExp }

/**
 * Data gap descriptor used to drive progressive user prompts.
 */
export interface DataGap {
  field: Extract<keyof VehicleData, string> | string
  required: boolean
  prompt: string
  validationRules?: ValidationRule[]
  defaultValue?: unknown
}

export interface Adjustment {
  factor: string;
  impact: number; // e.g. +500, -1200
  description: string;
}

export interface MarketFactor {
  factor: string;
  impact: number;
  description: string;
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
