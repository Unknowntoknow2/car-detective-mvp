
import { ConditionLevel } from '@/components/lookup/types/manualEntry';

export interface FormData {
  make?: string;
  model?: string;
  year?: number;
  mileage: number;
  condition: ConditionLevel;
  zipCode: string;
  fuelType: string;
  transmission: string;
  vin?: string;
  plate?: string;
  stateCode?: string;
  trim?: string;
  bodyType?: string;
  color?: string;
  accidentHistory?: boolean;
  accidentSeverity?: string;
  features?: string[];
  serviceHistory?: boolean;
  serviceFrequency?: string;
  ownerCount?: number;
  drivingBehavior?: string;
  photos?: File[];
  photoUrls?: string[];
  conditionScore: number;
  valuationId?: string;
  userId?: string;
  
  // Adding missing properties
  hasAccident?: boolean | 'yes' | 'no';
  accidentDescription?: string;
  drivingProfile?: 'light' | 'average' | 'heavy';
  saleDate?: string | Date;
  bodyStyle?: string;
  conditionLabel?: string;
  exteriorColor?: string;
  interiorColor?: string;
  colorMultiplier?: number;
  identifierType?: string;
  valuation?: number;
  confidenceScore?: number;
}

export interface PremiumFeatureProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface PremiumTestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
}

// Add FeatureOption interface for components using it
export interface FeatureOption {
  id: string | number;
  name: string;
  description?: string;
  category?: string;
  value?: number;
  impact?: number;
  selected?: boolean;
}
