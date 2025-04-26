
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

interface Vehicle {
  make: string;
  model: string;
  year: number;
  trim?: string;
  vin?: string;
  exteriorColor?: string;
  mileage?: number;
  fuelType?: string;
  bodyType?: string;
  transmissionType?: string;
  drivetrainType?: string;
  engine?: string;
}

interface ValuationContextType {
  vehicle: Vehicle | null;
  valuationId: string | null;
  isLoading: boolean;
  setVehicle: (vehicle: Vehicle | null) => void;
  setValuationId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  clearValuation: () => void;
  saveValuationToHistory: () => void;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export function ValuationProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearValuation = () => {
    setVehicle(null);
    setValuationId(null);
    localStorage.removeItem("premium_vehicle");
    toast.info("Valuation data cleared");
  };

  const saveValuationToHistory = () => {
    if (!vehicle || !valuationId) {
      toast.error("No valuation data to save");
      return;
    }

    // In a real implementation, this would save to a database
    // For now, we'll just show a toast
    toast.success("Valuation saved to history");
  };

  return (
    <ValuationContext.Provider
      value={{
        vehicle,
        valuationId,
        isLoading,
        setVehicle,
        setValuationId,
        setIsLoading,
        clearValuation,
        saveValuationToHistory,
      }}
    >
      {children}
    </ValuationContext.Provider>
  );
}

export function useValuationContext() {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error("useValuationContext must be used within a ValuationProvider");
  }
  return context;
}
