
import { ValuationResult } from '@/components/valuation/valuation-core/ValuationResult';

export interface ValuationSummaryProps {
  valuation?: ValuationResult;
  confidenceScore?: number;
  estimatedValue?: number;
  vehicleInfo?: any;
  onEmailReport?: () => void;
  showEstimatedValue?: boolean;
}
