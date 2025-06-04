<<<<<<< HEAD

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
=======
import { AdjustmentBreakdown, RulesEngineInput } from "../types";
import { AdjustmentCalculator } from "./adjustmentCalculator";
import { supabase } from "@/integrations/supabase/client";

export class WarrantyCalculator implements AdjustmentCalculator {
  async calculate(
    input: RulesEngineInput,
  ): Promise<AdjustmentBreakdown | null> {
    if (input.warrantyStatus && input.warrantyStatus !== "None") {
      try {
        // Fetch warranty factor from the database
        const { data: warrantyData } = await supabase
          .from("warranty_options")
          .select("multiplier, description")
          .eq("status", input.warrantyStatus)
          .single();

        if (!warrantyData) {
          return null;
        }

        const multiplier = warrantyData.multiplier;
        const percentAdjustment = (multiplier - 1) * 100;
        const value = Math.round(input.basePrice * (multiplier - 1));
        const factor = "Warranty Status";
        const impact = value;

        return {
          name: "Warranty Status",
          value: value,
          percentAdjustment: percentAdjustment,
          description: warrantyData.description ||
            `Vehicle has ${input.warrantyStatus} warranty that affects value`,
          factor,
          impact,
        };
      } catch (error) {
        console.error("Error fetching warranty factor:", error);
        return null;
      }
    }

    return null;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }
}
