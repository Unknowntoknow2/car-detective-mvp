
import { EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';

export interface ReportData {
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  zipCode: string;
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  generatedAt: string;
  transmission?: string;
  trim?: string;
  color?: string;
  fuelType?: string;
  bodyStyle?: string;
  photoUrl?: string;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary: string;
  } | null;
  priceRange?: [number, number];
}

export interface ReportOptions {
  isPremium: boolean;
  includeExplanation: boolean;
  includeBranding: boolean;
  includeAIScore: boolean;
  includeFooter: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
  enrichedData?: EnrichedVehicleData;
}
