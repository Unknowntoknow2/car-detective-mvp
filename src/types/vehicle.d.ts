
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
  fuelType?: string;
  transmission?: string;
  createdAt: string;
  updatedAt?: string;
  images?: string[]; // Added for compatibility with some components
}

export interface DecodedVehicleInfo {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  color?: string;
  exteriorColor?: string;
  interiorColor?: string;
  fuelType?: string;
  features?: string[];
  condition?: string;
  zipCode?: string; 
  mileage?: number;
  valuationId?: string;
  // Add the missing valuation properties
  estimatedValue?: number;
  confidenceScore?: number;
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
  price_range?: { low: number; high: number } | [number, number];
  priceRange?: { low: number; high: number } | [number, number]; // Add this for consistency
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
