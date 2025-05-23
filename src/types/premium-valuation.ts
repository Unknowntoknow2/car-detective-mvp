
import { ConditionLevel } from '@/components/lookup/types/manualEntry';

export interface FormData {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: ConditionLevel;
  conditionLabel?: string;
  zipCode?: string;
  accidentHistory?: boolean;
  accidentDetails?: {
    severity?: 'minor' | 'moderate' | 'severe';
    repaired?: boolean;
  };
  drivingBehavior?: 'cautious' | 'normal' | 'aggressive';
  transmission?: string;
  features?: string[];
  photos?: File[];
  photoUrls?: string[];
  hasWarranty?: boolean;
  warrantyType?: string;
  fuelType?: string;
  bodyType?: string;
  valueAdjustments?: {
    conditionImpact?: number;
    mileageImpact?: number;
    featureImpact?: number;
    locationImpact?: number;
  };
}

export interface ValidationStep {
  title: string;
  description: string;
  isCompleted: boolean;
  isValid: boolean;
}

export interface ValuationParams {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: ConditionLevel;
  zipCode?: string;
  features?: string[];
}

export interface ValuationResponse {
  estimatedValue: number;
  confidenceScore: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  explanation?: string;
}
