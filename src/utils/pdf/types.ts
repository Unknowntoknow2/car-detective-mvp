
import { AICondition } from '@/types/photo';

export interface ReportOptions {
  paperSize: 'letter' | 'a4' | 'legal';
  orientation: 'portrait' | 'landscape';
  includeWatermark: boolean;
  includeValuationBreakdown: boolean;
  includeVehicleHistory: boolean;
  includeVehicleImages: boolean;
  includeMarketTrends: boolean;
  includeCarfaxData: boolean;
  headerLogo?: string;
  footerText?: string;
  color: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    muted: string;
    background: string;
  };
}

export interface ReportData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  trim?: string;
  color?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  vin?: string;
  userId?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  photoExplanation?: string;
  aiCondition?: AICondition | null;
  explanation?: string;
  features?: string[];
  isPremium?: boolean;
  generatedAt: string;
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor: string;
  impact: number;
  impactPercentage?: number;
}
