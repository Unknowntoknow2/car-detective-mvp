
// Import PDFKit for PDF document types
import { PDFDocument } from 'pdf-lib';

export interface ReportData {
  // Vehicle information
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  trim?: string;
  color?: string;
  bodyStyle?: string;
  transmission?: string;
  engineSize?: string;
  fuelType?: string;
  
  // Valuation information
  estimatedValue: number;
  confidenceScore: number;
  photoScore?: number;
  
  // Location information
  zipCode: string;
  regionName?: string;
  stateCode?: string;
  
  // Condition information
  aiCondition: AICondition;
  photoCondition?: any;
  bestPhotoUrl?: string;
  vehiclePhotos?: string[];
  
  // Owner information
  ownerCount?: number;
  titleStatus?: string;
  
  // Accident information
  accidentCount?: number;
  
  // Additional information
  adjustments?: AdjustmentItem[];
  premium?: boolean;
  reportDate?: Date;
  generatedDate: Date;
}

export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected: string[];
  summary: string;
}

export interface AdjustmentItem {
  factor: string;
  impact: number;
  description: string;
}

export interface FooterData {
  reportDate?: Date;
  pageNumber: number;
  totalPages: number;
}

export interface SectionParams {
  doc: any;
  pageWidth?: number;
  pageHeight?: number;
  margin?: number;
  data: ReportData;
  y: number;
}

export interface PremiumSectionParams extends SectionParams {
  title: string;
  description?: string;
}

export interface PremiumHeaderParams {
  doc: any;
  pageWidth?: number;
  pageHeight?: number;
  logoPath: string;
  title: string;
  subtitle?: string;
}

export type PDFDocumentWithOutline = PDFDocument & {
  outline: {
    addItem: (title: string) => void;
  };
};
