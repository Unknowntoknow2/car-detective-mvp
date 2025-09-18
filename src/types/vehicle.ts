
export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  trim?: string;
}

export interface DecodedVehicleInfo {
  vin?: string;
  plate?: string;
  state?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  engine?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  doors?: string;
  seats?: string;
  displacement?: string;
  engineCylinders?: string;
  displacementL?: string;
  mileage?: number;
  condition?: string;
  color?: string;
  confidenceScore?: number;
  zipCode?: string;
  photos?: string[];
  primaryPhoto?: string;
  estimatedValue?: number;
  // VIN enrichment fields
  enrichmentScore?: number;
  lastEnrichedAt?: string;
  source?: 'nhtsa' | 'vinaudit' | 'cache' | 'fallback' | 'vpic';
  enhancedData?: {
    carfaxReport?: any;
    marketData?: any;
    msrp?: number;
    features?: string[];
    packageDetails?: any;
  };
}

export interface PlateLookupInfo {
  plate: string;
  state: string;
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  mileage?: number;
  condition?: string;
  color?: string;
}

export interface VehicleTrim {
  id: string;
  name: string;
  year: number;
  make: string;
  model: string;
  msrp?: number;
  fuelType?: string;
  transmission?: string;
  engineType?: string;
}

export interface UnifiedVehicleData {
  vin?: string;
  plate?: string;
  state?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  bodyType?: string;
  bodyStyle?: string;
  fuelType?: string;
  drivetrain?: string;
  displacement?: string;
  doors?: string;
  seats?: string;
  exteriorColor?: string;
  interiorColor?: string;
  color?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  photos?: string[];
  primaryPhoto?: string;
  estimatedValue?: number;
  confidenceScore?: number;
}

export type {
  VehicleData,
  VehicleDataCanonical,
} from '../../apps/ain-valuation-engine/src/types/canonical';
export { toCanonicalVehicleData } from '../../apps/ain-valuation-engine/src/types/canonical';
