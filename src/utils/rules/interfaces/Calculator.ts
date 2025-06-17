
import { ValuationData, Adjustment } from '../types';

export interface Calculator {
  name: string;
  description: string;
  calculate(data: ValuationData): Adjustment | null;
}
