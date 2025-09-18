
import { AccidentDetails } from "./follow-up-answers";
import { ConditionOption, TireConditionOption } from "./condition";
import type { VehicleData } from "./vehicle";
export type { VehicleData } from "./vehicle";

export type PartialVehicleData = Partial<VehicleData> & {
  zip?: string;
  zipCode?: string;
};

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
