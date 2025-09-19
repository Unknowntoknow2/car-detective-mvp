
import { AccidentDetails } from "./follow-up-answers";
import { ConditionOption, TireConditionOption } from "./condition";
import type { PartialVehicleData, VehicleData } from "@shared/types/vehicle-data";
export type { PartialVehicleData, VehicleData } from "@shared/types/vehicle-data";

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
