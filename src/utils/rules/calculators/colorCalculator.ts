
import { RulesEngineInput, AdjustmentCalculator } from '../types';

export class ColorCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput) {
    // Check if exteriorColor exists
    const exteriorColor = input.exteriorColor || '';
    const colorMultiplier = input.colorMultiplier || 1.0;
    
    // Calculate the percentage impact based on the multiplier
    // Subtract 1 to get the percentage change (e.g. 1.05 => 5%)
    const impact = ((colorMultiplier - 1.0) * 100);
    
    return {
      factor: "Exterior Color",
      impact,
      description: exteriorColor 
        ? `${exteriorColor} color adjustment` 
        : "Standard color",
      name: "Exterior Color",
      value: impact,
      percentAdjustment: impact
    };
  }
}
