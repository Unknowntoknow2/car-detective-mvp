
/**
 * Data required for generating a valuation report
 */
export interface ReportData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  priceRange?: [number, number];
  generatedAt: string;
  userId?: string;
  isPremium?: boolean;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    summary?: string;
  };
  photoScore?: number;
  bestPhotoUrl?: string;
  explanation?: string;
  narrative?: string;
  vin?: string;
}

/**
 * Options for PDF report generation
 */
export interface ReportOptions {
  includeHeader: boolean;
  includeFooter: boolean;
  includePageNumbers: boolean;
  includePhotos: boolean;
  includeLegalDisclaimer: boolean;
  theme: 'light' | 'dark';
  format?: string;
  orientation?: string;
  margin?: number;
  includeBranding?: boolean;
  includeTimestamp?: boolean;
  includePhotoAssessment?: boolean;
  includeAIScore?: boolean;
  isPremium?: boolean;
  title?: string;
  printBackground?: boolean;
  landscape?: boolean;
  showWholesaleValue?: boolean;
  userName?: string;
  dealerName?: string;
}

/**
 * Default options for PDF generation
 */
export const defaultReportOptions: ReportOptions = {
  includeHeader: true,
  includeFooter: true,
  includePageNumbers: true,
  includePhotos: true,
  includeLegalDisclaimer: true,
  theme: 'light',
  includeBranding: true,
  includeTimestamp: true,
  includePhotoAssessment: true,
  includeAIScore: true,
  isPremium: false,
  title: 'Vehicle Valuation Report'
};

/**
 * Parameters for drawing PDF sections
 */
export interface SectionParams {
  doc: any;
  pageWidth: number;
  margin: number;
  regularFont: any;
  boldFont: any;
  primaryColor: any;
  secondaryColor: any;
  textColor: any;
}
