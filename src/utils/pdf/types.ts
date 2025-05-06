
import { CarfaxData } from '@/utils/carfax/mockCarfaxService';
import { ForecastResult } from '@/utils/forecasting/valuation-forecast';

export interface ReportData {
  vin: string;
  make: string;
  model: string;
  year: number | string; // Support both number and string for flexibility
  mileage: string | number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number | null;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }> | Array<{ label: string; value: number }>;
  features?: string[];
  fuelType?: string;
  transmission?: string;
  color?: string;
  bodyStyle?: string;
  bodyType?: string; // Alias for bodyStyle for backward compatibility
  accidentHistory?: string;
  serviceHistory?: string;
  ownerCount?: number;
  titleStatus?: string;
  photo?: string;
  explanation?: string;
  
  // Add the missing properties
  plate?: string;
  state?: string;
  carfaxData?: CarfaxData;
  isPremium?: boolean;
  location?: string;
  valuationId?: string;
  
  // Add AI condition assessment
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
}

export interface ValuationReportOptions {
  mileage: number | string;
  estimatedValue: number;
  condition: string;
  zipCode: string;
  confidenceScore: number;
  adjustments?: Array<{
    label: string;
    value: number;
  }> | Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  carfaxData?: CarfaxData;
  forecast?: ForecastData;
  fuelType?: string;
  isPremium?: boolean;
  explanation?: string;
}

export interface ForecastData {
  estimatedValueAt12Months: number;
  percentageChange: number;
  bestTimeToSell: string;
  valueTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface PremiumReportInput {
  vehicleInfo: {
    vin?: string;
    year: number;
    make: string;
    model: string;
    mileage?: number;
    zipCode?: string;
  };
  valuation: {
    basePrice: number;
    estimatedValue: number;
    priceRange: [number, number];
    confidenceScore: number;
    adjustments: Array<{
      label: string;
      value: number;
    }>;
  };
  carfaxData?: CarfaxData;
  forecast?: ForecastData;
  explanation?: string; // Add explanation property
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
}
