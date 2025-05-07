
import { AdjustmentBreakdown } from '@/types/valuation';
import { AICondition } from '@/types/photo';

export interface ReportData {
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage: number | string;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  priceRange?: [number, number];
  confidenceScore: number;
  adjustments?: AdjustmentBreakdown[];
  aiCondition?: AICondition | null;
  aiSummary?: string;
  bestPhotoUrl?: string;
  explanation?: string;
  features?: string[];
  valuationId?: string;
  plate?: string;
  state?: string;
  // Add missing properties that are being used
  isPremium?: boolean;
  narrative?: string;
  // Fields being used in tests/converters
  color?: string;
  bodyStyle?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  photoExplanation?: string;
}

export interface ReportOptions {
  includeBranding: boolean;
  includeAIScore: boolean;
  includeFooter: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
  isPremium?: boolean;
  // Add missing properties used in pdfGeneratorService
  format?: string;
  printBackground?: boolean;
  landscape?: boolean;
  showWholesaleValue?: boolean;
  dealerName?: string;
  title?: string;
  userName?: string;
}

export interface SectionParams {
  doc: any;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  fontSize: number;
  lineHeight: number;
  // Add missing properties used in section files
  page?: any;
  contentWidth?: number;
  // Add any other properties that might be used
}
