
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from "../types";

export class LocationCalculator implements AdjustmentCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown> {
    const zipCode = input.zipCode;
    const basePrice = input.basePrice || 20000; // Default if not provided
    
    // In a real implementation, this would call an API or database
    // to get the regional demand multiplier
    const multiplier = await this.getRegionalMultiplier(zipCode);
    
    // Calculate impact
    const impact = Math.round(basePrice * multiplier);
    const regionName = await this.getRegionName(zipCode);
    
    return {
      factor: "Regional Market",
      impact,
      description: `Market demand in ${regionName} affects vehicle value`
    };
  }
  
  private async getRegionalMultiplier(zipCode: string): Promise<number> {
    // Mock implementation - in a real app, this would lookup from database
    // Add artificial delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Example regional demand multipliers (simplified)
    const firstDigit = zipCode.charAt(0);
    const zipMultipliers: Record<string, number> = {
      "0": 0.02,  // New England (higher demand)
      "1": 0.01,  // Northeast
      "2": 0.005, // Mid-Atlantic
      "3": -0.01, // Southeast
      "4": -0.005, // Midwest
      "5": -0.01, // South
      "6": -0.005, // South Central
      "7": 0,     // Midwest/Plains (neutral)
      "8": 0.01,  // Mountain
      "9": 0.03   // West Coast (highest demand)
    };
    
    return zipMultipliers[firstDigit] || 0;
  }
  
  private async getRegionName(zipCode: string): Promise<string> {
    // Mock implementation - in a real app, this would lookup from database
    // Add artificial delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Example region names (simplified)
    const firstDigit = zipCode.charAt(0);
    const regionNames: Record<string, string> = {
      "0": "New England",
      "1": "Northeast",
      "2": "Mid-Atlantic",
      "3": "Southeast",
      "4": "Midwest",
      "5": "South",
      "6": "South Central",
      "7": "Midwest/Plains",
      "8": "Mountain",
      "9": "West Coast"
    };
    
    return regionNames[firstDigit] || "Unknown Region";
  }
}
