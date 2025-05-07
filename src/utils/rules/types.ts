
export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor?: string;
  impact?: number;
}

export interface RulesEngineInput {
  make: string;
  model: string;
  year?: number;
  mileage: number;
  condition: string;
  zipCode?: string;
  zip?: string;
  basePrice: number;
  photoScore?: number;
  accidentCount?: number;
  carfaxScore?: number;
  features?: string[];
  premiumFeatures?: string[];
  equipmentIds?: number[];
  exteriorColor?: string;
  colorMultiplier?: number;
  fuelType?: string;
  fuelTypeMultiplier?: number;
  transmissionType?: string;
  transmissionMultiplier?: number;
  hasOpenRecall?: boolean;
  recallMultiplier?: number;
  warrantyStatus?: string;
  warrantyMultiplier?: number;
  bodyStyle?: string;
  saleDate?: string | Date;
  drivingProfile?: string;
  drivingProfileMultiplier?: number;
}
