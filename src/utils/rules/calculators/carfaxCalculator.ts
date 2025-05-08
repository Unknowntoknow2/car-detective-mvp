
import { RulesEngineInput, AdjustmentCalculator } from '../types';

export class CarfaxCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput) {
    // Check if carfaxData exists
    const hasCarfaxData = !!input.carfaxData;
    const impact = hasCarfaxData ? 2 : 0;
    
    return {
      factor: "CARFAX Report",
      impact,
      description: hasCarfaxData 
        ? "CARFAX report verified" 
        : "No CARFAX data available",
      name: "CARFAX Report",
      value: impact,
      percentAdjustment: impact / input.baseValue * 100
    };
  }
}
