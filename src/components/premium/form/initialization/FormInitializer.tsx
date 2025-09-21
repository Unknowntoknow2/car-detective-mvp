
import { useEffect } from "react";
import { FormData } from "@/types/premium-valuation";
import { toast } from "sonner";

interface FormInitializerProps {
  initialLoad: boolean;
  setInitialLoad: (value: boolean) => void;
  loadSavedData: () => FormData | null;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateStepValidity: (step: number, isValid: boolean) => void;
}

export function FormInitializer({
  initialLoad,
  setInitialLoad,
  loadSavedData,
  setFormData,
  updateStepValidity,
}: FormInitializerProps) {
  useEffect(() => {
    if (initialLoad) {
      const savedFormData = loadSavedData();
      const savedVehicleData = localStorage.getItem("premium_vehicle");

      if (savedVehicleData) {
        try {
          const vehicleData = JSON.parse(savedVehicleData);
          setFormData((prev: FormData) => ({
            ...prev,
            ...vehicleData,
          }));

          updateStepValidity(1, true);
          localStorage.removeItem("premium_vehicle");

          toast.success("Vehicle information loaded from previous lookup");
        } catch (error) {
        }
      } else if (savedFormData) {
        setFormData(savedFormData);
      }

      setInitialLoad(false);
    }
  }, [
    initialLoad,
    loadSavedData,
    setFormData,
    updateStepValidity,
    setInitialLoad,
  ]);

  return null;
}
