<<<<<<< HEAD

import { AdjustmentBreakdown, RulesEngineInput } from "../types";
=======
import { Calculator } from "../interfaces/Calculator";
import { AdjustmentBreakdown, RulesEngineInput } from "../types";

export class TransmissionCalculator implements Calculator {
  public async calculate(
    input: RulesEngineInput,
  ): Promise<AdjustmentBreakdown | null> {
    // Skip if no transmission type information is provided
    if (!input.transmissionType || !input.transmissionMultiplier) {
      return null;
    }

    // Calculate the adjustment value
    const adjustmentPercentage = (input.transmissionMultiplier - 1) * 100;
    const adjustmentValue = input.basePrice *
      (input.transmissionMultiplier - 1);
    const factor = "Transmission";
    const impact = Math.round(adjustmentValue);

    // Only create an adjustment if there's an actual impact
    if (input.transmissionMultiplier === 1) {
      return null;
    }

    // Get the category based on the multiplier
    let category = "Standard";
    if (input.transmissionMultiplier > 1) {
      category = "Premium";
    } else if (input.transmissionMultiplier < 1) {
      category = "Discount";
    }
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export class TransmissionCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    // Get transmission type (use transmissionType as per interface)
    const transmission = input.transmissionType || "Automatic";
    const basePrice = input.basePrice || 20000; // Default if not provided
    
    // Get multiplier based on transmission type
    const multiplier = this.getTransmissionMultiplier(transmission);
    
    // Calculate impact
    const impact = Math.round(basePrice * multiplier);
    
    return {
<<<<<<< HEAD
      factor: "Transmission Type",
      impact,
      description: this.getTransmissionDescription(transmission, impact)
=======
      name: "Transmission",
      value: Math.round(adjustmentValue),
      percentAdjustment: adjustmentPercentage,
      description:
        `${input.transmissionType} is a ${category.toLowerCase()} transmission type (${
          adjustmentPercentage > 0 ? "+" : ""
        }${adjustmentPercentage.toFixed(0)}% adjustment)`,
      factor,
      impact,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    };
  }
  
  private getTransmissionMultiplier(transmission: string): number {
    // Normalize transmission type for comparison
    const normalizedType = transmission.toLowerCase();
    
    if (normalizedType.includes("manual")) {
      // Most vehicles with manual transmission are less desirable
      // in the current market, except for sports cars
      return -0.03; // 3% reduction
    } else if (normalizedType.includes("cvt")) {
      // CVTs are often seen as less reliable in some models
      return -0.01; // 1% reduction
    } else if (normalizedType.includes("dual-clutch") || 
              normalizedType.includes("dct")) {
      // Dual-clutch transmissions are premium in many models
      return 0.02; // 2% premium
    } else if (normalizedType.includes("automatic")) {
      // Standard automatic is the baseline
      return 0; // No adjustment
    } else {
      // Unknown transmission type
      return 0; // No adjustment
    }
  }
  
  private getTransmissionDescription(transmission: string, impact: number): string {
    if (impact > 0) {
      return `${transmission} transmission adds premium value`;
    } else if (impact < 0) {
      return `${transmission} transmission is less desirable in current market`;
    } else {
      return `${transmission} transmission has standard market value`;
    }
  }
}
