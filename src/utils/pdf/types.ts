
export interface ReportData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode?: string;
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    name?: string;
    value?: number;
    description?: string;
    percentAdjustment?: number;
  }>;
  generatedAt: string;
  vin?: string;
  color?: string;
  bodyType?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  isPremium?: boolean;
  aiCondition?: any;
  explanation?: string;
  fuelType?: string;
  transmission?: string;
  features?: string[];
  photoExplanation?: string;
  valuationId?: string;
  narrative?: string;
  trim?: string;
}

export interface ReportOptions {
  includeHeader: boolean;
  includeFooter: boolean;
  includePageNumbers: boolean;
  includePhotos: boolean;
  includeLegalDisclaimer: boolean;
  theme: 'light' | 'dark';
  logoUrl?: string;
  customStyles?: Record<string, any>;
  format?: string;
  orientation?: 'portrait' | 'landscape';
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
  dealerName?: string;
  userName?: string;
}

export interface SectionParams {
  doc: any;
  page: any;
  width?: number;
  height?: number;
  margin?: number;
  pageWidth?: number;
  contentWidth?: number;
  fonts?: {
    regular: any;
    bold: any;
  };
  regularFont?: any;
  boldFont?: any;
  constants?: {
    margin: number;
    width: number;
    height: number;
    titleFontSize: number;
    headingFontSize: number;
    normalFontSize: number;
    smallFontSize: number;
  };
}
