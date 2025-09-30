// Google-level: Comprehensive API types for codeQuality.test.ts

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
}

export interface ApiResponse<T = any> {
  status: number;
  data: T;
  error?: ApiError;
}

export interface SessionData {
  sessionId: string;
  userId?: string;
  createdAt: string;
  expiresAt?: string;
  [key: string]: any;
}

export interface VehicleData {

  vin: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  color?: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  [key: string]: any;
}
