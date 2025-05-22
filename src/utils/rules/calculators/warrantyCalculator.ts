
import { AdjustmentBreakdown, RulesEngineInput } from "../types";

export class WarrantyCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    // Get warranty status
    const warrantyStatus = input.warrantyStatus || "Expired";
    const basePrice = input.basePrice || 20000; // Default if not provided
    
    // Calculate multiplier based on warranty status
    const multiplier = this.getWarrantyMultiplier(warrantyStatus);
    
    // Calculate impact
    const impact = Math.round(basePrice * multiplier);
    
    return {
      factor: "Warranty Status",
      impact,
      description: this.getWarrantyDescription(warrantyStatus)
    };
  }
  
  private getWarrantyMultiplier(status: string): number {
    // Normalize status for comparison
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes("full") || 
        normalizedStatus.includes("bumper-to-bumper")) {
      // Full factory warranty has highest value
      return 0.05; // 5% premium
    } else if (normalizedStatus.includes("powertrain")) {
      // Powertrain warranty has moderate value
      return 0.03; // 3% premium
    } else if (normalizedStatus.includes("extended")) {
      // Extended warranty has good value
      return 0.04; // 4% premium
    } else if (normalizedStatus.includes("certified") || 
              normalizedStatus.includes("cpo")) {
      // Certified pre-owned warranty has very good value
      return 0.06; // 6% premium
    } else if (normalizedStatus.includes("partial")) {
      // Partial warranty has some value
      return 0.02; // 2% premium
    } else if (normalizedStatus.includes("expired") || 
              normalizedStatus.includes("none")) {
      // Expired warranty has no value premium
      return 0; // No adjustment
    } else {
      // Unknown warranty status
      return 0; // No adjustment
    }
  }
  
  private getWarrantyDescription(status: string): string {
    // Normalize status for comparison
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes("full") || 
        normalizedStatus.includes("bumper-to-bumper")) {
      return "Full factory warranty adds significant value";
    } else if (normalizedStatus.includes("powertrain")) {
      return "Powertrain warranty provides additional value";
    } else if (normalizedStatus.includes("extended")) {
      return "Extended warranty coverage increases value";
    } else if (normalizedStatus.includes("certified") || 
              normalizedStatus.includes("cpo")) {
      return "Certified pre-owned warranty program adds premium value";
    } else if (normalizedStatus.includes("partial")) {
      return "Partial warranty coverage adds some value";
    } else if (normalizedStatus.includes("expired") || 
              normalizedStatus.includes("none")) {
      return "No active warranty coverage";
    } else {
      return "Warranty status unknown";
    }
  }
}
