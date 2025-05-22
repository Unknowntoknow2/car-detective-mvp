
export interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore: number;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    mileage?: number;
    condition?: string;
  };
  onReset?: () => void;
}
