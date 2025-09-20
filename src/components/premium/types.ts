
import { ValuationResult } from '@/types/vehicleData';

export interface ValuationSummaryProps {
  valuation?: ValuationResult;
  confidenceScore?: number;
  estimatedValue?: number;
  vehicleInfo?: any;
  onEmailReport?: () => void;
  showEstimatedValue?: boolean;
}
