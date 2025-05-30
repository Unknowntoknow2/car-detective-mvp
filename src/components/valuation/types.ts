
export interface ValuationResultProps {
  valuationId?: string;
  isManualValuation?: boolean;
  manualValuationData?: any;
}

export interface ValuationData {
  success: boolean;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  valuationId: string;
  vin?: string;
  zipCode?: string;
  accidents?: number;
  isPremium?: boolean;
}
