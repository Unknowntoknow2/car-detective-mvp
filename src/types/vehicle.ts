<<<<<<< HEAD

=======
// src/types/vehicle.ts
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

// Consolidated vehicle types for the entire application

export interface VehicleMake {
  id: string;
  make_name: string;
  logo_url?: string | null;
  country_of_origin?: string | null;
  nhtsa_make_id?: number | null;
  popular?: boolean;
}

export interface VehicleModel {
  id: string;
  make_id: string;
  model_name: string;
  nhtsa_model_id?: string | null;
  popular?: boolean;
}

export interface VehicleTrim {
  id: string;
  model_id: string;
  trim_name: string;
  year?: number;
  fuel_type?: string;
  transmission?: string;
  engine_type?: string;
  msrp?: number;
  description?: string;
  image_url?: string;
}

// Form data structure for vehicle selection
export interface VehicleSelectionData {
  makeId: string;
  makeName: string;
  modelId: string;
  modelName: string;
  trimId?: string;
  trimName?: string;
  year: number;
}

// Validation interfaces
export interface VehicleValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// API response interfaces
export interface VehicleApiResponse<T> {
  data: T[];
  error: string | null;
  isLoading: boolean;
}

// Enhanced DecodedVehicleInfo interface with all properties used across the codebase
export interface DecodedVehicleInfo {
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  fuelType?: string;
  engineCylinders?: string;
  displacementL?: string;
  seats?: string;
  doors?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  mileage?: number;
  condition?: string;
  exteriorColor?: string;
  color?: string;
  plate?: string;
  state?: string;
  valuationId?: string;
  photos?: string[];
  primaryPhoto?: string;
  interiorColor?: string;
  displacement?: string;
  features?: string[]; // Added missing features property
  zipCode?: string; // Added missing zipCode property
}

// Enhanced ValuationResponse interface with all vehicle properties
export interface ValuationResponse {
  success: boolean;
  data?: any;
  error?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  priceRange?: [number, number];
  // Added vehicle properties that are used in the codebase
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  valuationId?: string;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  bodyStyle?: string;
  color?: string;
  trim?: string;
  vin?: string;
  isPremium?: boolean;
  price_range?: {
    low: number;
    high: number;
  };
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
  };
  userId?: string;
}

