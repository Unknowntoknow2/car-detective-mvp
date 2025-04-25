
import { CarfaxData } from '../carfax/mockCarfaxService';
import { ForecastResult } from '../forecasting/valuation-forecast';

export interface ReportData {
  make: string;
  model: string;
  year: number | string;
  mileage: number | string;
  vin?: string;
  plate?: string;
  state?: string;
  color?: string;
  estimatedValue: number;
  fuelType?: string;
  condition?: string;
  location?: string;
  transmission?: string;
  zipCode?: string;
  confidenceScore?: number;
  adjustments?: { label: string; value: number }[];
  carfaxData?: CarfaxData;
  isPremium?: boolean;
  bodyType?: string;
}

export interface ValuationReportOptions {
  mileage: number;
  estimatedValue: number;
  condition: string;
  zipCode: string;
  confidenceScore: number;
  adjustments: Array<{
    label: string;
    value: number;
  }>;
  carfaxData?: CarfaxData;
  forecast?: ForecastData;
  fuelType?: string;
  isPremium?: boolean;
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
}
