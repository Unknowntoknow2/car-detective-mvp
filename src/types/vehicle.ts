
// src/types/vehicle.ts

export interface DecodedVehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType?: string;
  engineType?: string;
  transmission?: string;
  exteriorColor?: string;
  interiorColor?: string;
  fuelType?: string;
  mileage?: number;
  drivetrainType?: string;
  // Add missing fields needed by components
  engine?: string;
  drivetrain?: string;
}

export interface VehicleDetails extends DecodedVehicleInfo {
  id?: string;
  userId?: string;
  condition?: string;
  priceHistory?: PriceHistoryItem[];
  features?: string[];
  photos?: string[];
  titleStatus?: string;
  accidents?: number;
  owners?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceHistoryItem {
  date: string;
  price: number;
  source?: string;
}
