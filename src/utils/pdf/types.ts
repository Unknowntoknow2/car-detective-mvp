
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
