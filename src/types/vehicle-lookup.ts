
import { AccidentDetails } from "./follow-up-answers";
import { ConditionOption, TireConditionOption } from "./condition";

export interface VehicleLookupData {
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage?: number;
  condition?: ConditionOption;
  zipCode?: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
}

export interface LookupFormData {
  vin?: string;
  plate?: string;
  state?: string;
  make?: string;
  model?: string;
  year?: string;
  mileage?: string;
  condition?: ConditionOption;
  zipCode?: string;
}

export interface VehicleLookupResult {
  vehicle: VehicleLookupData;
  valuation?: number;
  confidence?: number;
  sources?: string[];
}

export type LookupMethod = 'vin' | 'plate' | 'manual';
export type LookupTier = 'free' | 'premium';
