
// src/types/ValuationTypes.ts
// Canonical schema. Single source of truth comes from ./canonical.
import type { VehicleData, VehicleDataCanonical } from './canonical'
export type { VehicleData, VehicleDataCanonical } from './canonical'
export { toCanonicalVehicleData } from './canonical'
// Keep alias for legacy imports
export type LegacyVehicleData = VehicleDataCanonical
export type ValuationResult = ValuationResultCanonical

/**
 * Runtime-friendly vehicle condition options used throughout the valuation UI.
 */
export const VehicleCondition = {
  EXCELLENT: "excellent",
  VERY_GOOD: "very_good",
  GOOD: "good",
  FAIR: "fair",
  POOR: "poor",
} as const;

export type VehicleCondition = (typeof VehicleCondition)[keyof typeof VehicleCondition];

/**
 * Canonical title status values for valuation workflows.
 */
export const TitleStatus = {
  CLEAN: "clean",
  SALVAGE: "salvage",
  REBUILT: "rebuilt",
  FLOOD: "flood",
  LEMON: "lemon",
  MANUFACTURER_BUYBACK: "manufacturer_buyback",
} as const;

export type TitleStatus = (typeof TitleStatus)[keyof typeof TitleStatus];

/**
 * Validation rule definition for data collection prompts.
 */
export type ValidationRule =
  | { type: "required"; message: string }
  | { type: "min" | "max"; message: string; value: number }
  | { type: "pattern"; message: string; value: RegExp };

/**
 * Data gap descriptor used to drive progressive user prompts.
 */
export interface DataGap {
  field: keyof VehicleData | string;
  required: boolean;
  prompt: string;
  validationRules?: ValidationRule[];
  defaultValue?: unknown;
}

export interface Adjustment {
  factor: string;
  impact: number; // e.g. +500, -1200
  description: string;
  percentage?: number; // optional percent change for UI display
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
  confidencePercent?: number; // optional helper for UI display
  adjustments: Adjustment[];
  marketFactors: MarketFactor[];
  vehicleData: VehicleDataCanonical;
  explanation: string;
  factors?: string[];
}

export interface RateLimit {
  limit: number;
  remaining: number;
  resetTime: Date;
}

export interface ApiMetadata {
  source?: string;
  timestamp?: Date;
  rateLimit?: RateLimit;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  metadata?: ApiMetadata;
}

export interface DecodedVinResult {
  Variable: string;
  Value: string;
  ValueId?: string;
}

export interface SessionData {
  userId?: string;
  startTime: string;
  lastActivity: string;
  conversationState?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
}

export interface AccidentRecord {
  date: string;
  severity: 'minor' | 'moderate' | 'severe';
  damageDescription: string;
  estimatedCost?: number;
}

export interface ServiceRecord {
  date: string;
  type: string;
  mileage: number;
  description: string;
  cost?: number;
  dealer?: string;
}

export interface OwnershipRecord {
  startDate: string;
  endDate?: string;
  type: 'personal' | 'fleet' | 'rental' | 'lease';
  state: string;
}

export interface TitleRecord {
  date: string;
  state: string;
  type: string;
  mileage?: number;
}

export interface RecallRecord {
  recallNumber: string;
  date: string;
  description: string;
  status: 'open' | 'completed' | 'not_applicable';
}

export interface VehicleHistory {
  vin?: string;
  accidentHistory: AccidentRecord[];
  serviceRecords: ServiceRecord[];
  ownershipHistory: OwnershipRecord[];
  titleHistory: TitleRecord[];
  recallHistory: RecallRecord[];
}

// Do not redeclare VehicleData/VehicleDataCanonical here. They come from ./canonical.
