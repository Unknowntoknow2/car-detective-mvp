
export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor';

export interface VehicleFeature {
  name: string;
  value: number;
  description: string;
}

export interface TrimAdjustment {
  trim: string;
  value: number;
}
