import { DecodedVehicleInfo } from './vehicle';

export interface APIResponse<T> {
  data: T | null;
  success: boolean;
  error?: string;
  message?: string;
}

export interface DecodedVINResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface PhotoScoringResponse {
  id: string;
  score: number;
  scoreDetails?: {
    quality: number;
    relevance: number;
    completeness: number;
  };
  detectedIssues?: string[];
  vehicleDetected: boolean;
  message?: string;
}

export interface ValuationResponse {
  id: string;
  estimated_value: number;
  confidence_score: number;
  // Other properties
}

export interface Valuation {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimated_value: number;
  confidence_score: number;
  created_at: string;
  features?: string[];
  isPremium?: boolean;
  condition_score?: number;
}
