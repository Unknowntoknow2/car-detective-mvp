
import { AccidentDetails } from "./follow-up-answers";
import { ConditionOption, TireConditionOption } from "./condition";
// Local type definitions since shared types are not available
export interface PartialVehicleData {
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  mileage?: number;
  condition?: ConditionOption;
  zip?: string;
  zipCode?: string;
  trim?: string;
  fuelType?: string;
  drivetrain?: string;
  transmission?: string;
  engine?: string;
  color?: string;
}

export interface VehicleData extends PartialVehicleData {
  trim?: string;
  engine?: string;
  mileage?: number;
  color?: string;
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
  vehicle: PartialVehicleData;
  valuation?: number;
  confidence?: number;
  sources?: string[];
}

export type LookupMethod = 'vin' | 'plate' | 'manual';
export type LookupTier = 'free' | 'premium';
