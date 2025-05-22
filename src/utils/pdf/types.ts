
import { PDFFont, RGB } from 'pdf-lib';

export interface ReportData {
  // Vehicle Information
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage: number;
  vin?: string;
  
  // Valuation Information
  estimatedValue: number;
  priceRange?: [number, number];
  conditionAdjustment?: number;
  mileageAdjustment?: number;
  locationAdjustment?: number;
  marketAdjustment?: number;
  
  // Condition Information
  aiCondition?: string; // Changed from condition to aiCondition
  conditionScore?: number;
  conditionNotes?: string[];
  
  // Location Information
  zipCode?: string;
  regionName?: string;
  
  // Photo Assessment
  photoAssessment?: {
    exterior?: string[];
    interior?: string[];
    mechanical?: string[];
  };
  
  // Additional Information
  generatedDate?: Date;
  explanation?: string;
  features?: string[];
  premium?: boolean;
}

export interface SectionParams {
  data: ReportData;
  page: any;
  y: number;
  width?: number;
  height?: number;
  margin?: number;
  contentWidth?: number;
  regularFont?: PDFFont;
  boldFont?: PDFFont;
  textColor?: RGB;
  primaryColor?: RGB;
}

export interface ReportOptions {
  includeBranding: boolean;
  includeExplanation: boolean;
  includePhotoAssessment: boolean;
  watermark: boolean;
  fontSize: number;
  pdfQuality: 'draft' | 'standard' | 'high';
}

export interface ReportGeneratorParams {
  data: ReportData;
  options: ReportOptions;
  document: typeof PDFDocument; // Fixed to use typeof PDFDocument
}
