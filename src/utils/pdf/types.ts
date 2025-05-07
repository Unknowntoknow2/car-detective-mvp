
import { PDFPage, PDFFont } from 'pdf-lib';

export interface ReportData {
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage: string | number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  valuationId?: string;
  color?: string;
  bodyStyle?: string;
  bodyType?: string;
  fuelType?: string;
  explanation?: string;
  isPremium?: boolean;
  transmission?: string;
  plate?: string;
  state?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  photoExplanation?: string;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
}

export interface ReportOptions {
  includeBranding: boolean;
  includeAIScore: boolean;
  includeFooter: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
}

export interface SectionParams {
  page: PDFPage;
  width: number;
  height: number;
  margin: number;
  regularFont: PDFFont;
  boldFont: PDFFont;
  contentWidth?: number;
}

export interface AIConditionParams {
  aiCondition: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  bestPhotoUrl?: string;
  photoExplanation?: string;
}

export interface AIConditionSectionParams {
  page: PDFPage;
  yPosition: number;
  margin: number;
  width: number;
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
    italic?: PDFFont;
  };
}
