
import { AdjustmentBreakdown, RulesEngineInput } from '../types';

export interface Calculator {
  calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null>;
}
