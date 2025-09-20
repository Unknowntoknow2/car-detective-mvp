export type NHTSARecall = { number: string; description: string };
export type VehicleSpecification = { make: string; model: string; year: number };

export interface FuelEconomy {
  cityMpg?: number;
  highwayMpg?: number;
  combinedMpg?: number;
  fuelCostPerYearUSD?: number;
}

export type EnrichedVehicleProfile = VehicleSpecification & { 
  vin?: string;
  trim?: string;
  fuelEconomy?: FuelEconomy;
  marketValueUSD?: number;
  recalls?: NHTSARecall[];
};

export interface ValuationInputs {
  vin: string;
  year: number;
  make: string;
  model: string;
  mileage?: number;
  zipCode?: string;
}

export const DefaultAdjustmentBreakdown = { mileage: 0, condition: 0 };
export const DefaultValuationResult = { value: 0, confidence: 0.0 };
