
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
