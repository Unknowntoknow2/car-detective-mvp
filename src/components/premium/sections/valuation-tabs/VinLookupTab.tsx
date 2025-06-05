
import React from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import VinLookup from "../../lookup/VinLookup";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VinLookupTabProps {
  vinValue: string;
  isLoading: boolean;
  vehicle: any;
  onVinChange: (value: string) => void;
  onLookup: () => void;
}

export function VinLookupTab(
  { vinValue, isLoading, vehicle, onVinChange, onLookup }: VinLookupTabProps,
) {
  const navigate = useNavigate();

  const handleContinueToValuation = () => {
    if (!vehicle) return;

    // Save the vehicle details to local storage for the premium form
    localStorage.setItem(
      "premium_vehicle",
      JSON.stringify({
        identifierType: "vin",
        identifier: vinValue,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        trim: vehicle.trim || "Standard",
      }),
    );

    toast.success(
      "Vehicle information saved. Continuing to premium valuation.",
    );
    navigate("/premium-valuation");
  };

  return (
    <TabContentWrapper
      title="VIN Lookup"
      description="Enter your Vehicle Identification Number for the most accurate valuation"
    >
      <VinLookup
        value={vinValue}
        onChange={onVinChange}
        onLookup={onLookup}
        isLoading={isLoading}
      />
      {vehicle && (
        <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-xl mb-4">Vehicle Found</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Year, Make, Model</p>
              <p className="font-medium">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Trim</p>
              <p className="font-medium">{vehicle.trim || "Standard"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Engine</p>
              <p className="font-medium">{vehicle.engine || "Not available"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Transmission</p>
              <p className="font-medium">
                {vehicle.transmission || "Not available"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="bg-primary" onClick={handleContinueToValuation}>
              Continue to Valuation
            </Button>
          </div>
        </div>
      )}
    </TabContentWrapper>
  );
}
