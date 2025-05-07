
import { AdjustmentBreakdown } from '@/types/valuation';
import { AICondition } from '@/types/photo';

export interface ReportData {
  vin?: string;
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
  valuationId?: string;
  plate?: string;
  state?: string;
}

export interface ReportOptions {
  includeBranding: boolean;
  includeAIScore: boolean;
  includeFooter: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
  isPremium?: boolean;
}

export interface SectionParams {
  doc: any;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  fontSize: number;
  lineHeight: number;
}
