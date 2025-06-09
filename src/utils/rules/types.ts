
export interface ValuationData {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  trim?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
  zipCode?: string;
  features?: string[];
  photoScore?: number;
  carfax?: {
    cleanTitle?: boolean;
    accidentCount?: number;
    serviceRecords?: number;
  };
  recalls?: Array<{
    id: string;
    severity: 'high' | 'medium' | 'low';
    completed: boolean;
  }>;
  warranty?: {
    factory?: {
      active: boolean;
      monthsRemaining?: number;
    };
    powertrain?: {
      active: boolean;
      monthsRemaining?: number;
    };
    extended?: {
      active: boolean;
    };
  };
}

export interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}
