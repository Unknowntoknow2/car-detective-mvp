
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
    description?: string;
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
}

export interface SectionParams {
  doc: any;
  page: any;
  fonts: {
    regular: any;
    bold: any;
  };
  constants: {
    margin: number;
    width: number;
    height: number;
    titleFontSize: number;
    headingFontSize: number;
    normalFontSize: number;
    smallFontSize: number;
  };
}
