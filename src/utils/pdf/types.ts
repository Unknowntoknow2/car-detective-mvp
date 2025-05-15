
import { PDFPage, PDFFont, Color } from 'pdf-lib';

export interface ReportData {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number; // Required property for compatibility
  mileage?: number;
  condition?: string;
  zipCode?: string;
  estimatedValue?: number;
  adjustments?: { factor: string; impact: number; description: string }[];
  confidenceScore?: number;
  generatedAt?: string;
  priceRange?: number[] | [number, number];
  vin?: string;
  trim?: string;
  features?: string[];
  color?: string;
  bodyType?: string;
  fuelType?: string;
  explanation?: string;
  transmission?: string;
}

export interface ReportOptions {
  title?: string;
  showPriceRange?: boolean;
  showConfidenceScore?: boolean;
  logo?: string;
  brandColor?: string;
  locale?: string;
  showWholesaleValue?: boolean; // Add missing property
  dealerName?: string; // Add missing property
  format?: string; // Add missing property
  landscape?: boolean; // Add missing property
  userName?: string; // Add missing property
}

export interface SectionParams {
  page: PDFPage;
  data: ReportData;
  y: number;
  doc: any; // Add doc property
  margin: number; // Add margin property
  margins?: { left: number; right: number; top: number; bottom: number };
  contentWidth: number;
  width: number; // Add width property
  pageWidth: number; // Add pageWidth property
  boldFont: PDFFont;
  regularFont: PDFFont;
  primaryColor: Color;
  secondaryColor: Color; // Add secondaryColor property
  textColor: Color;
  height: number; // Add height property
}

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description?: string; // Make description optional in AdjustmentBreakdown
  name?: string;
  value?: number;
  percentAdjustment?: number;
  adjustment?: number;
  impactPercentage?: number;
}
