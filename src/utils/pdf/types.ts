
import { AICondition, AdjustmentBreakdown } from '@/types/photo';

export interface ReportData {
  id: string;
  userId?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  zipCode: string;
  vin?: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  bodyType?: string;
  confidenceScore?: number;
  priceRange?: number[];
  adjustments?: AdjustmentBreakdown[];
  aiCondition?: AICondition;
  generatedAt: string;
  bestPhotoUrl?: string;
  isPremium?: boolean;
  // Add missing properties
  explanation?: string;
  photoScore?: number;
  photoExplanation?: string;
  narrative?: string;
  features?: string[];
}

export interface ReportOptions {
  emailTo?: string;
  includeBreakdown?: boolean;
  includeMarketTrends?: boolean;
  includeSimilarVehicles?: boolean;
  watermark?: boolean;
  branding?: boolean;
  templateId?: string;
  isPremium?: boolean;
  // Add missing properties
  includeHeader?: boolean;
  includeFooter?: boolean;
  includePageNumbers?: boolean;
  includePhotos?: boolean;
  includeLegalDisclaimer?: boolean;
  theme?: 'light' | 'dark';
  includeBranding?: boolean;
  includeTimestamp?: boolean;
  includePhotoAssessment?: boolean;
  includeAIScore?: boolean;
  title?: string;
  landscape?: boolean;
  showWholesaleValue?: boolean;
  dealerName?: string;
  userName?: string;
  format?: string;
  orientation?: string;
  margin?: number;
  printBackground?: boolean;
}

// Add the missing SectionParams type
export interface SectionParams {
  page: any;
  margin: number;
  width: number;
  height: number;
  contentWidth: number;
  boldFont: any;
  regularFont: any;
  primaryColor: any;
  textColor: any;
  secondaryColor?: any;
}
