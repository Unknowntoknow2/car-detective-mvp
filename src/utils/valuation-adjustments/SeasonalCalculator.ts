
import { AdjustmentBreakdown, RulesEngineInput } from "../rules/types";

export class SeasonalCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    // Get current month (1-12)
    const currentMonth = new Date().getMonth() + 1;
    
    // Get vehicle type
    const bodyType = input.bodyType || input.bodyStyle || this.guessBodyType(input.make, input.model);
    const basePrice = input.basePrice || 20000; // Default if not provided
    
    // Get seasonal multiplier based on vehicle type and month
    const multiplier = this.getSeasonalMultiplier(bodyType, currentMonth);
    
    // Calculate impact
    const impact = Math.round(basePrice * multiplier);
    
    return {
      factor: "Seasonal Demand",
      impact,
      description: this.getSeasonalDescription(bodyType, currentMonth, impact > 0)
    };
  }
  
  private guessBodyType(make: string, model: string): string {
    // This is a simplified guess - in a real app, would use a database
    // of vehicle types or an API
    const normalizedModel = model.toLowerCase();
    
    // Try to guess convertibles
    if (normalizedModel.includes("convertible") || 
        normalizedModel.includes("spyder") || 
        normalizedModel.includes("spider") || 
        normalizedModel.includes("roadster") ||
        normalizedModel.includes("cabriolet")) {
      return "convertible";
    }
    
    // Try to guess SUVs
    if (normalizedModel.includes("suv") || 
        normalizedModel.includes("crossover") || 
        normalizedModel.includes("explorer") || 
        normalizedModel.includes("highlander") ||
        normalizedModel.includes("4runner") ||
        normalizedModel.includes("pilot") ||
        normalizedModel.includes("rav4") ||
        normalizedModel.includes("equinox") ||
        normalizedModel.includes("cherokee") ||
        normalizedModel.includes("tahoe") ||
        normalizedModel.includes("yukon")) {
      return "suv";
    }
    
    // Try to guess trucks
    if (normalizedModel.includes("truck") || 
        normalizedModel.includes("pickup") || 
        normalizedModel.includes("silverado") || 
        normalizedModel.includes("sierra") ||
        normalizedModel.includes("f-150") ||
        normalizedModel.includes("ram") ||
        normalizedModel.includes("tacoma") ||
        normalizedModel.includes("tundra") ||
        normalizedModel.includes("frontier") ||
        normalizedModel.includes("ridgeline")) {
      return "truck";
    }
    
    // Try to guess sports cars
    if (normalizedModel.includes("sport") || 
        normalizedModel.includes("mustang") || 
        normalizedModel.includes("camaro") || 
        normalizedModel.includes("corvette") ||
        normalizedModel.includes("911") ||
        normalizedModel.includes("boxster") ||
        normalizedModel.includes("miata") ||
        normalizedModel.includes("supra") ||
        normalizedModel.includes("challenger") ||
        normalizedModel.includes("charger")) {
      return "sport";
    }
    
    // Default to sedan/generic if can't determine
    return "generic";
  }
  
  private getSeasonalMultiplier(bodyType: string, month: number): number {
    // Normalize body type for comparison
    const normalizedType = bodyType.toLowerCase();
    
    // Seasonal adjustment factors by vehicle type and month
    const seasonalFactors: Record<string, number[]> = {
      // Highest demand in spring and summer
      "convertible": [0, -0.04, -0.02, 0.01, 0.02, 0.03, 0.04, 0.03, 0.01, -0.01, -0.02, -0.03],
      // Highest demand in winter months
      "suv": [0, 0.02, 0.01, 0, -0.01, -0.01, -0.02, -0.01, 0, 0.01, 0.01, 0.02],
      // Similar to SUVs but with stronger effect
      "truck": [0, 0.03, 0.02, 0.01, -0.01, -0.02, -0.02, -0.01, 0, 0.01, 0.02, 0.03],
      // Similar to convertibles but less pronounced
      "sport": [0, -0.02, -0.01, 0, 0.01, 0.02, 0.02, 0.02, 0.01, 0, -0.01, -0.02],
      // Less affected by seasonality
      "generic": [0, 0, 0, 0.01, 0.01, 0, 0, 0, 0.01, 0, 0, 0]
    };
    
    // Get the appropriate seasonal factor for this vehicle type
    // If type not found, use generic
    const typeFactors = seasonalFactors[normalizedType] || seasonalFactors.generic;
    
    // Return the seasonal factor for the current month (adjusting for 0-based array)
    return typeFactors[month - 1];
  }
  
  private getSeasonalDescription(bodyType: string, month: number, isPositive: boolean): string {
    const seasons = ["Winter", "Winter", "Spring", "Spring", "Spring", "Summer", 
                    "Summer", "Summer", "Fall", "Fall", "Fall", "Winter"];
    const currentSeason = seasons[month - 1];
    
    if (isPositive) {
      return `${currentSeason} is a high-demand season for ${bodyType} vehicles`;
    } else {
      return `${currentSeason} typically has lower demand for ${bodyType} vehicles`;
    }
  }
}
