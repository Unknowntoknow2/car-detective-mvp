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

export interface FuelEconomyData {
  fuelType: string;
  cityMpg: number | null;
  highwayMpg: number | null;
  combinedMpg: number | null;
  fuelCostPerYearUSD?: number;
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
  nhtsaRecalls?: any[];

  marketValueUSD?: number | null;
  valuationConfidence?: string;

  currentMileage?: number;
  condition?: string;
  zipCode?: string;
}
