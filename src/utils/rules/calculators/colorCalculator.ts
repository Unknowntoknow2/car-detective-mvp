
import { AdjustmentBreakdown, RulesEngineInput } from "../types";

export class ColorCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    const defaultColor = "default";
    const color = input.exteriorColor?.toLowerCase() || defaultColor;
    const multiplier = input.colorMultiplier || this.getDefaultMultiplier(color);
    const basePrice = input.basePrice || 20000; // Default if not provided
    
    // Calculate impact
    const impact = Math.round(basePrice * multiplier);
    
    return {
      factor: "Exterior Color",
      impact,
      description: this.getColorDescription(color, multiplier)
    };
  }
  
  private getDefaultMultiplier(color: string): number {
    // Premium colors have positive multipliers
    const premiumColors = ["pearl", "metallic", "white pearl", "crystal"];
    
    // Standard colors have zero multiplier
    const standardColors = ["white", "black", "silver", "gray"];
    
    // Less desirable colors have negative multipliers
    const lessDesirableColors = ["purple", "yellow", "green", "brown"];
    
    if (premiumColors.some(c => color.includes(c))) {
      return 0.02; // 2% premium
    } else if (lessDesirableColors.some(c => color.includes(c))) {
      return -0.01; // 1% discount
    } else {
      return 0; // No adjustment for standard colors
    }
  }
  
  private getColorDescription(color: string, multiplier: number): string {
    if (multiplier > 0) {
      return `${this.capitalizeColor(color)} is a premium color that increases value`;
    } else if (multiplier < 0) {
      return `${this.capitalizeColor(color)} is less desirable in the current market`;
    } else {
      return `${this.capitalizeColor(color)} is a standard color with neutral market impact`;
    }
  }
  
  private capitalizeColor(color: string): string {
    return color.charAt(0).toUpperCase() + color.slice(1);
  }
}
