
import { PDFFont, RGB } from 'pdf-lib';

export interface ReportData {
  // Vehicle Information
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number; // Changed from required to optional
  vin?: string;
  
  // Valuation Information
  estimatedValue: number;
  price?: number;
  priceRange?: [number, number];
  conditionAdjustment?: number;
  mileageAdjustment?: number;
  locationAdjustment?: number;
  marketAdjustment?: number;
  
  // Condition Information
  aiCondition?: string | { 
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
    [key: string]: string[] | undefined; // Add index signature for photoAssessment
  };
  photoUrl?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  photoExplanation?: string;
  
  // Document Information
  id?: string;
  reportTitle?: string;
  reportDate?: Date;
  disclaimerText?: string;
  companyName?: string;
  website?: string;
  
  // Additional Information
  generatedDate?: Date;
  generatedAt?: string;
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
  doc?: any;
  pageWidth?: number;
  pageHeight?: number;
}

export interface ReportOptions {
  includeBranding: boolean;
  includeExplanation: boolean;
  includePhotoAssessment: boolean;
  watermark: boolean;
  fontSize: number;
  pdfQuality: 'draft' | 'standard' | 'high';
  pageSize?: string;
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
