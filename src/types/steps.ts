
export interface StepConfig {
  component: string;
  shouldShow: boolean;
  props: Record<string, unknown>;
}

export interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: string;
  vin?: string;
  estimatedValue?: number;
}
