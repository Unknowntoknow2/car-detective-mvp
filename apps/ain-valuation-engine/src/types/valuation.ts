export interface ValuationInputs {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  currentMileage?: number;
  condition?: string;
  zipCode?: string;
}

// Main valuation interfaces and types

import { FuelEconomyData } from '../services/fuelEconomyService';

export interface NHTSARecall {
  id: string;
  campaignNumber: string;
  component: string;
  summary: string;
  consequence: string;
  remedy: string;
  notes?: string;
  recallDate: string;
}

export interface VehicleSpecification {
  bodyStyle?: string;
  drivetrain?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  seatingCapacity?: number;
  doors?: number;
}

export interface EnrichedVehicleProfile {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  manufacturer?: string;
  vehicleType?: string;

  fuelEconomy?: FuelEconomyData;
  nhtsaRecalls?: NHTSARecall[];

  marketValueUSD?: number | null;
  valuationConfidence?: string;

  currentMileage?: number;
  condition?: string;
  zipCode?: string;
}
