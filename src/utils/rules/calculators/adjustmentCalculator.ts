
import { AdjustmentBreakdown, RulesEngineInput } from '../types';

export interface AdjustmentCalculator {
  calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> | AdjustmentBreakdown | null;
}
