
// Import PDF library types
import { PDFDocument, PDFPage, PDFFont, Color } from 'pdf-lib';

/**
 * Report data model for PDF generation
 */
export interface ReportData {
  // Vehicle information
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  condition: string;
  
  // Valuation information
  estimatedValue: number;
  confidenceScore: number;
  
  // Location information
  zipCode?: string;
  
  // Optional base values (if not provided, calculated from adjustments)
  baseValue?: number;
  
  // Price range (optional)
  priceRange?: [number, number] | { min: number; max: number; };
  
  // Price adjustments
  adjustments: AdjustmentItem[];
  
  // Premium flag
  premium?: boolean;
  isPremium?: boolean;
  
  // Timestamps
  generatedAt: string;
  
  // Optional explanation
  explanation?: string;
  
  // Optional vehicle details
  transmission?: string;
  trim?: string;
  color?: string;
  fuelType?: string;
  bodyStyle?: string;
  
  // Optional photo URL
  photoUrl?: string;
  
  // Optional AI condition assessment
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary: string;
    score?: number;
  } | null;
}

/**
 * Adjustment item for price breakdown
 */
export interface AdjustmentItem {
  factor: string;
  impact: number;
  description?: string;
}

/**
 * Report generation options
 */
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
  // Additional options
  isPremium?: boolean;
  includeBranding?: boolean;
  includePhotoAssessment?: boolean;
}

/**
 * Section parameters for PDF section generators
 */
export interface SectionParams {
  // PDF document and page
  pdfDoc: PDFDocument;
  page: PDFPage;
  
  // Report data and options
  data: ReportData;
  options: Partial<ReportOptions>;
  
  // Fonts and styling
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
  };
  fontSize: number;
  
  // Positioning
  startY: number;
  y?: number;
  margin: number;
  width: number;
  height?: number;
  pageWidth: number;
  pageHeight?: number;
  
  // Colors
  textColor?: Color;
  primaryColor?: Color;
}

/**
 * PDF Rotation types enumeration
 */
export enum RotationTypes {
  Degrees = 'degrees',
  Radians = 'radians'
}

/**
 * PDF Rotation definition
 */
export interface Rotation {
  type: RotationTypes;
  angle: number;
}
