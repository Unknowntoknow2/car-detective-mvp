
export interface SectionParams {
  page: any;
  margin: number;
  contentWidth: number;
  boldFont: string;
  regularFont: string;
  primaryColor: string;
  textColor: string;
  height?: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  doc?: any; // Added for some sections that use doc instead of page
}

export interface ReportData {
  // Base fields
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  price: number; // Required property
  condition: string;
  
  // Additional fields
  features?: string[];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  explanation?: string;
  createdAt?: string;
  generatedAt?: string;
  narrative?: string; // Added for buildValuationReport.ts
  
  // Added fields that are used in the codebase
  estimatedValue?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  zipCode?: string;
  userId?: string;
  isPremium?: boolean;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    summary?: string;
    aiSummary?: string;
  } | null;
  bestPhotoUrl?: string;
  photoScore?: number;
  bodyType?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
  trim?: string;
}

export interface ReportOptions {
  includeBreakdown: boolean;
  includeMarketTrends: boolean;
  includeSimilarVehicles: boolean;
  watermark: boolean;
  branding: boolean;
  templateId: string;
  isPremium: boolean;
  includeHeader: boolean;
  includeFooter: boolean;
  includePageNumbers: boolean;
  includePhotos: boolean;
  includeLegalDisclaimer: boolean;
  theme: 'light' | 'dark';
  includeBranding: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
  includeAIScore: boolean;
  title: string;
}

export interface ValuationSummaryProps {
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  comparableVehicles?: number;
}

export interface ManualEntryFormProps {
  onSubmit: (data: any) => void;
  submitButtonText: string;
  isPremium?: boolean;
  isLoading?: boolean; // Added for compatibility with ManualLookup.tsx and ValuationFlow.tsx
}
