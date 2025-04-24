
import { PlateLookupInfo } from '@/types/lookup';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { CarfaxData } from '../carfax/mockCarfaxService';

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
}

export interface ValuationReportOptions {
  mileage?: number | string;
  estimatedValue?: number;
  confidenceScore?: number;
  condition?: string;
  adjustments?: { label: string; value: number }[];
  zipCode?: string;
  fuelType?: string;
  carfaxData?: CarfaxData;
  isPremium?: boolean;
}
