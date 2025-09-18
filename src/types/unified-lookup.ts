
// Unified types for all vehicle lookup functionality
export interface UnifiedVehicleData {
  // Core identification
  vin?: string;
  plate?: string;
  state?: string;
  
  // Basic vehicle info
  year: number;
  make: string;
  model: string;
  trim?: string;
  
  // Technical details
  engine?: string;
  transmission?: string;
  bodyType?: string;
  bodyStyle?: string;
  fuelType?: string;
  drivetrain?: string;
  displacement?: string;
  doors?: string;
  seats?: string;
  
  // Appearance
  exteriorColor?: string;
  interiorColor?: string;
  color?: string; // fallback
  
  // Condition & usage
  mileage?: number;
  condition?: string;
  zipCode?: string;
  
  // Media
  photos?: string[];
  primaryPhoto?: string;
  
  // Valuation
  estimatedValue?: number;
  confidenceScore?: number;
}

export interface UnifiedLookupFormData {
  // VIN lookup
  vin?: string;
  
  // Plate lookup
  plate?: string;
  state?: string;
  
  // Manual entry
  make?: string;
  model?: string;
  year?: string;
  mileage?: string;
  condition?: string;
  zipCode?: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
}

export interface UnifiedLookupResult {
  vehicle: UnifiedVehicleData;
  source: 'vin' | 'plate' | 'manual' | 'vpic' | 'carfax';
  tier: 'free' | 'premium';
  confidence: number;
  enhancedData?: {
    carfaxReport?: any;
    marketData?: any;
    historyRecords?: any[];
  };
}

export type LookupMethod = 'vin' | 'plate' | 'manual';
export type LookupTier = 'free' | 'premium';
export type LookupSource = 'vin' | 'plate' | 'manual' | 'vpic' | 'carfax' | 'failed';

// Legacy type aliases for backwards compatibility
export type DecodedVehicleInfo = UnifiedVehicleData;
export type LegacyVehicleData = UnifiedVehicleData;
export type LookupFormData = UnifiedLookupFormData;
export type VehicleLookupResult = UnifiedLookupResult;
