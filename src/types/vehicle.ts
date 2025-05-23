
import { ValuationResult } from './valuation';

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
}
