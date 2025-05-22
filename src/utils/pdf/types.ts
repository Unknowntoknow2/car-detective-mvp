
import { PDFFont } from 'pdf-lib';

export interface ReportData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  vin?: string;
  zipCode?: string;
  generatedAt: string;
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary: string;
  };
  fuelType?: string;
  transmission?: string;
  bodyStyle?: string;
  color?: string;
  trim?: string;
  photoUrl?: string;
  priceRange?: [number, number] | { min: number; max: number };
  explanation?: string;
  isPremium?: boolean;
  premium?: boolean;
  baseValue?: number;
}

export interface ReportOptions {
  watermarkText: string;
  logoUrl: string;
  showPremiumWatermark: boolean;
  includeExplanation: boolean;
  includeComparables: boolean;
  includeFooter: boolean;
  footerText: string;
  primaryColor: string;
  secondaryColor: string;
  fonts: {
    titleFont: string;
    bodyFont: string;
  };
  isPremium?: boolean;
  includeBranding?: boolean;
  includePhotoAssessment?: boolean;
  watermark?: string;
  pdfDoc?: any;
}

export interface DocumentFonts {
  regular: PDFFont;
  bold: PDFFont;
  italic?: PDFFont;
  light?: PDFFont;
}

export interface SectionParams {
  page: any;
  fonts: DocumentFonts;
  data: ReportData;
  options: Partial<ReportOptions>;
  margin: number;
  width: number;
  pageWidth: number;
  startY: number;
  y?: number;
  textColor?: any;
  primaryColor?: any;
  height?: number;
  pdfDoc?: any;
}

export type AdjustmentItem = {
  factor: string;
  impact: number;
  description?: string;
};

export type Rotation = {
  type: RotationTypes;
  angle: number;
};

export type RotationTypes = 'radians' | 'degrees';
