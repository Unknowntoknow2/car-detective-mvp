
import { EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';
import { PDFPage, PDFFont, Color } from 'pdf-lib';

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
  isPremium?: boolean;
  explanation?: string;
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
  includeComparables?: boolean;
  footerText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fonts?: {
    titleFont: string;
    bodyFont: string;
  };
}

// Export AdjustmentItem interface
export interface AdjustmentItem {
  factor: string;
  impact: number;
  description?: string;
}

// Export DocumentFonts interface
export interface DocumentFonts {
  regular: PDFFont;
  bold: PDFFont;
  italic?: PDFFont;
}

// Export SectionParams interface
export interface SectionParams {
  page: PDFPage;
  fonts: DocumentFonts;
  data: ReportData;
  options: ReportOptions;
  margin: number;
  width: number;
  pageWidth: number;
  y?: number;
  startY: number;
  textColor?: Color;
  primaryColor?: Color;
}
