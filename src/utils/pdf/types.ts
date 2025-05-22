
import PDFDocument from 'pdfkit';

export interface ReportData {
  id?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin?: string;
  color?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  mileage?: number;
  estimatedValue: number;
  photoScore?: number;
  bestPhotoUrl?: string;
  photoUrl?: string;
  licensePlate?: string;
  engine?: string;
  doors?: number;
  aiCondition?: {
    summary: string;
    score: number;
    condition?: string;
    issuesDetected?: string[];
    confidenceScore?: number;
  };
  price?: number;
  zipCode?: string;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  isPremium?: boolean;
  explanation?: string;
  generatedAt?: string;
  companyName?: string;
  website?: string;
  reportDate?: Date;
  disclaimerText?: string;
}

export interface SectionParams {
  doc: PDFDocument;
  data: any;
  pageWidth: number;
  pageHeight: number;
  margin?: number;
  // Extended properties for PDF sections
  page?: any;
  y?: number;
  width?: number;
  regularFont?: any;
  boldFont?: any;
  contentWidth?: number;
  textColor?: any;
  primaryColor?: any;
  height?: number; // Added missing height property
}

export interface ReportOptions {
  pageSize: string;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  includePageNumbers: boolean;
  includePhotos: boolean;
  includeSimilarVehicles: boolean;
  companyInfo: {
    name: string;
    logo: string | null;
    website: string;
    phone: string;
  };
}

// Add the AdjustmentBreakdown interface for the adjustmentTable.ts file
export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description: string;
  name?: string;
  value?: number;
  percentAdjustment?: number;
}
