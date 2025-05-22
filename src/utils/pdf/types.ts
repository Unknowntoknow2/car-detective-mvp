
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
  price?: number; // Added to fix errors
  priceRange?: [number, number];
  conditionAdjustment?: number;
  mileageAdjustment?: number;
  locationAdjustment?: number;
  marketAdjustment?: number;
  
  // Condition Information
  aiCondition?: string | { // Changed from string to union type
    summary?: string;
    score?: number;
    confidenceScore?: number;
    issuesDetected?: string[];
    condition?: string;
  };
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
  photoUrl?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  photoExplanation?: string;
  
  // Document Information
  id?: string; // Added for tests
  reportTitle?: string;
  reportDate?: Date;
  disclaimerText?: string;
  companyName?: string;
  website?: string;
  
  // Additional Information
  generatedDate?: Date;
  generatedAt?: string; // Added for compatibility
  explanation?: string;
  features?: string[];
  premium?: boolean;
  
  // PDF-specific properties
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  confidenceScore?: number;
  bodyType?: string;
  bodyStyle?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
  isPremium?: boolean;
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
  doc?: any; // Added for sections
  pageWidth?: number; // Added for sections
  pageHeight?: number; // Added for sections
}

export interface ReportOptions {
  includeBranding: boolean;
  includeExplanation: boolean;
  includePhotoAssessment: boolean;
  watermark: boolean;
  fontSize: number;
  pdfQuality: 'draft' | 'standard' | 'high';
  pageSize?: string; // Added for defaultReportOptions
}

export interface ReportGeneratorParams {
  data: ReportData;
  options: ReportOptions;
  document: typeof PDFDocument; // Fixed to use typeof PDFDocument
}

// Add AdjustmentBreakdown interface for PDF sections
export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description: string;
  name?: string;
  value?: number;
  percentAdjustment?: number;
}
