
export interface DecodedVehicleInfo {
  vin?: string;
  plate?: string;
  state?: string;
  year?: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  bodyType?: string;
  fuelType?: string;
  drivetrain?: string;
  doors?: number;
  seats?: number;
  color?: string;
  exteriorColor?: string;
  interiorColor?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  valuationId?: string;
  isComplete?: boolean;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  features?: string[];
}

export interface VehicleLookupRequest {
  vin?: string;
  plate?: string;
  state?: string;
  zipCode?: string;
}

export interface VehicleLookupResponse {
  success: boolean;
  vehicle?: DecodedVehicleInfo;
  error?: string;
  message?: string;
}

export interface ValuationResponse {
  estimatedValue: number;
  confidenceScore: number;
  valuationId: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  plate?: string;
  state?: string;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  trim?: string;
  color?: string;
  exteriorColor?: string;
  price_range?: { low: number; high: number } | [number, number];
  priceRange?: { low: number; high: number } | [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  gptExplanation?: string;
  explanation?: string;
  isPremium?: boolean;
  features?: string[];
  pdfUrl?: string;
  basePrice?: number;
  photoScore?: number;
  bestPhotoUrl?: string;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary?: string;
  };
  userId?: string;
}

export interface DealerInventoryItem {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
  photos: string[]; 
  vin: string;
  description?: string;
  trim?: string;
  bodyType?: string;
  color?: string;
  exteriorColor?: string;
  fuelType?: string;
  transmission?: string;
  createdAt: string;
  updatedAt?: string;
  images?: string[];
}

export interface VehicleValuation {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  estimatedValue: number;
  confidenceScore: number;
  createdAt: string;
  isPremium?: boolean;
}
