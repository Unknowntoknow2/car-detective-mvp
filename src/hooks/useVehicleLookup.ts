import { useState } from "react";
import { ManualEntryFormData } from "@/types/manual-entry";

export function useVehicleLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const lookupVehicle = async (
    type: "vin" | "plate" | "manual",
    value: string,
    state?: string,
    manualData?: ManualEntryFormData
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (type === "manual" && manualData) {
        setVehicle({
          make: manualData.make,
          model: manualData.model,
          year: manualData.year,
          vin: manualData.vin || "MANUAL_ENTRY"
        });
      } else {
        setVehicle({
          make: "Sample Make",
          model: "Sample Model",
          year: 2020,
          vin: value
        });
      }
    } catch (err) {
      setError("Failed to lookup vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  return { lookupVehicle, isLoading, vehicle, error };
}
