<<<<<<< HEAD

import { ConditionLevel } from '@/components/lookup/types/manualEntry';

// Re-export ConditionLevel so it can be imported from this module
export { ConditionLevel } from '@/components/lookup/types/manualEntry';

export interface FormData {
  make?: string;
  model?: string;
  year?: number;
  mileage: number;
  condition: ConditionLevel;
  zipCode: string;
=======
export interface FormData {
  identifierType: "vin" | "plate" | "manual" | "photo";
  identifier: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  zipCode: string;
  condition: string;
  conditionLabel?: string;
  conditionScore?: number;
  hasAccident: "yes" | "no";
  accidentDescription: string;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
<<<<<<< HEAD
  photoUrls?: string[];
  conditionScore: number;
=======
  drivingProfile: "light" | "average" | "heavy" | string; // Allow any string but prefer these values
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  valuationId?: string;
  userId?: string;
  
  // Adding missing properties
  hasAccident?: boolean | 'yes' | 'no';
  accidentDescription?: string;
  drivingProfile?: 'light' | 'average' | 'heavy';
  saleDate?: Date;
  bodyStyle?: string;
  conditionLabel?: string;
  exteriorColor?: string;
  interiorColor?: string;
  colorMultiplier?: number;
  identifierType?: string;
  valuation?: number;
  confidenceScore?: number;
  identifier?: string;
  
  // Maintenance history properties
  hasRegularMaintenance?: boolean | 'yes' | 'no';
  maintenanceNotes?: string;
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
  id: string;
  name: string;
  description?: string;
  category?: string;
  value: number;
  impact?: number;
  selected?: boolean;
}
