
import { ValuationResult } from '@/types/valuation';

export interface ValuationSummaryProps {
  valuation?: ValuationResult;
  confidenceScore?: number;
  estimatedValue?: number;
  vehicleInfo?: any;
  onEmailReport?: () => void;
  showEstimatedValue?: boolean;
}
