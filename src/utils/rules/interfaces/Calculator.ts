
import { ValuationData, Adjustment } from '../../valuation/rules/types';

export interface Calculator {
  name: string;
  description: string;
  calculate(data: ValuationData): Adjustment | null;
}
