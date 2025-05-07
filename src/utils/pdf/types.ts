
import { AdjustmentBreakdown } from '../valuation/types';
import { AICondition } from '@/types/photo';

export interface ReportData {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  priceRange: [number, number];
  confidenceScore: number;
  adjustments: AdjustmentBreakdown[];
  aiCondition?: AICondition;
  aiSummary?: string;
  bestPhotoUrl?: string;
  explanation?: string;
  features?: string[];
}

export interface ReportOptions {
  includeBranding: boolean;
  includeAIScore: boolean;
  includeFooter: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
}
