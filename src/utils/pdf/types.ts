
import { AICondition, AdjustmentBreakdown } from '@/types/photo';

export interface ReportData {
  id: string;
  userId?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  zipCode: string;
  vin?: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  bodyType?: string;
  confidenceScore?: number;
  priceRange?: number[];
  adjustments?: AdjustmentBreakdown[];
  aiCondition?: AICondition;
  generatedAt: string;
  bestPhotoUrl?: string;
  isPremium?: boolean;
}

export interface ReportOptions {
  emailTo?: string;
  includeBreakdown?: boolean;
  includeMarketTrends?: boolean;
  includeSimilarVehicles?: boolean;
  watermark?: boolean;
  branding?: boolean;
  templateId?: string;
  isPremium?: boolean;
}
