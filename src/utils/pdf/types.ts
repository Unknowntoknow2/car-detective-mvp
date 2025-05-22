
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
  priceRange?: [number, number]; // Standardized to always be a tuple
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
  fontSize?: number;
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
  fontSize?: number;
}

export type AdjustmentItem = {
  factor: string;
  impact: number;
  description?: string;
};

// Define rotation types as an enum for better type safety
export enum RotationTypes {
  Radians = "radians",
  Degrees = "degrees"
}

export type Rotation = {
  type: RotationTypes;
  angle: number;
};
