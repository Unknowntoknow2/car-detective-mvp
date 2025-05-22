
import { DecodedVehicleInfo } from './vehicle';

export interface VinDecoderResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface DecodedVINResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface PlateLookupResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ValidationResponse {
  isValid: boolean;
  errors?: Record<string, string>;
}

export interface ValuationResponse {
  valuationId: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  trim?: string;
  accidents?: number;
}
