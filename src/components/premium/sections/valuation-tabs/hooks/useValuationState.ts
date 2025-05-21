
import { useState } from "react";
import { useVehicleLookup } from "@/hooks/useVehicleLookup";
import { ValuationServiceId } from "../services";
import { toast } from "sonner";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";

export function useValuationState() {
  const [activeTab, setActiveTab] = useState<ValuationServiceId>("vin");
  const [vinValue, setVinValue] = useState("");
  const [plateValue, setPlateValue] = useState("");
  const [plateState, setPlateState] = useState("");
  const { lookupVehicle, isLoading, vehicleData: vehicle } = useVehicleLookup();
  
  const handleVinLookup = async () => {
    if (!vinValue || vinValue.length < 17) {
      toast.error("Please enter a valid 17-character VIN");
      return;
    }
    await lookupVehicle('vin', vinValue);
  };
  
  const handlePlateLookup = async () => {
    if (!plateValue) {
      toast.error("Please enter a license plate number");
      return;
    }
    if (!plateState) {
      toast.error("Please select a state");
      return;
    }
    await lookupVehicle('plate', plateValue, plateState);
  };

  const handleManualSubmit = (data: ManualEntryFormData) => {
    lookupVehicle('manual', 'manual-entry', undefined, data);
  };

  return {
    activeTab,
    setActiveTab,
    vinValue,
    setVinValue,
    plateValue,
    setPlateValue,
    plateState,
    setPlateState,
    isLoading,
    vehicle,
    handleVinLookup,
    handlePlateLookup,
    handleManualSubmit
  };
}
