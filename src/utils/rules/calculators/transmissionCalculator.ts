
import { AdjustmentBreakdown, RulesEngineInput } from "../types";

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
      factor: "Transmission Type",
      impact,
      description: this.getTransmissionDescription(transmission, impact)
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
