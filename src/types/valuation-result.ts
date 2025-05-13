
export interface ValuationResultProps {
  valuationId?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  location?: string;
  valuation?: number;
  isManualValuation?: boolean;
  features?: string[];
  // Add color property to match what's used in ValuationResultPage
  color?: string;
}
