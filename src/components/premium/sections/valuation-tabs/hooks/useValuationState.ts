
import { useState } from "react";
import { useVehicleLookup } from "@/hooks/useVehicleLookup";
import { ManualEntryFormData } from "@/types/manual-entry";

// Define missing types locally
interface VehicleData {
  make: string;
  model: string;
  year: number;
  vin?: string;
}

enum ConditionLevel {
  Poor = "Poor",
  Fair = "Fair", 
  Good = "Good",
  VeryGood = "Very Good",
  Excellent = "Excellent"
}

export function useValuationState() {
  const [activeTab, setActiveTab] = useState("vin");
  const [vinData, setVinData] = useState("");
  const [plateData, setPlateData] = useState({ plate: "", state: "" });
  const [manualData, setManualData] = useState<ManualEntryFormData>({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(), // Convert to string
    mileage: "0", // Convert to string
    condition: ConditionLevel.Good,
    zipCode: "",
  });
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);

  const { lookupVehicle, isLoading, vehicle, error } = useVehicleLookup();

  const handleVinLookup = async () => {
    if (vinData.length === 17) {
      await lookupVehicle("vin", vinData);
    }
  };

  const handlePlateLookup = async () => {
    if (plateData.plate && plateData.state) {
      await lookupVehicle("plate", plateData.plate, plateData.state);
    }
  };

  const handleManualSubmit = async () => {
    await lookupVehicle("manual", "", undefined, manualData);
  };

  return {
    activeTab,
    setActiveTab,
    vinData,
    setVinData,
    plateData,
    setPlateData,
    manualData,
    setManualData,
    vehicleData: vehicle || vehicleData,
    setVehicleData,
    isLoading,
    error,
    handleVinLookup,
    handlePlateLookup,
    handleManualSubmit,
  };
}
