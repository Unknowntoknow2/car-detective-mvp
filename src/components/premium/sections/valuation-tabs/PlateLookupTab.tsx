<<<<<<< HEAD

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UnifiedPlateLookup } from '@/components/lookup/plate/UnifiedPlateLookup';
=======
import { TabContentWrapper } from "./TabContentWrapper";
import { PlateLookup } from "../../lookup/PlateLookup";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface PlateLookupTabProps {
  plateValue: string;
  plateState: string;
  isLoading: boolean;
  vehicle: any;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onLookup: () => void;
}

export function PlateLookupTab({
  plateValue,
<<<<<<< HEAD
  plateState,
=======
  stateValue,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  isLoading,
  vehicle,
  onPlateChange,
  onStateChange,
<<<<<<< HEAD
  onLookup
}: PlateLookupTabProps) {
  const handleVehicleFound = (data: any) => {
    onPlateChange(data.plate);
    onStateChange(data.state);
    onLookup();
=======
  onLookup,
}: PlateLookupTabProps) {
  const navigate = useNavigate();

  const handleContinueToValuation = () => {
    if (!vehicle) return;

    // Save the vehicle details to local storage for the premium form
    localStorage.setItem(
      "premium_vehicle",
      JSON.stringify({
        identifierType: "plate",
        identifier: plateValue,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        state: stateValue,
        exteriorColor: vehicle.exteriorColor || null,
      }),
    );

    toast.success(
      "Vehicle information saved. Continuing to premium valuation.",
    );
    navigate("/premium-valuation");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
  
  return (
<<<<<<< HEAD
    <Card>
      <CardContent className="p-6">
        <UnifiedPlateLookup
          tier="premium"
          onVehicleFound={handleVehicleFound}
          showPremiumFeatures={true}
          includePremiumBadging={false}
        />
        
        {vehicle && (
          <div className="mt-4 p-4 bg-primary/5 rounded-md">
            <p className="font-medium">Found: {vehicle.year} {vehicle.make} {vehicle.model}</p>
            {vehicle.trim && <p className="text-sm text-muted-foreground">Trim: {vehicle.trim}</p>}
          </div>
        )}
      </CardContent>
    </Card>
=======
    <TabContentWrapper
      title="Plate Lookup"
      description="Enter your license plate and state for quick vehicle identification"
    >
      <PlateLookup
        plateValue={plateValue}
        stateValue={stateValue}
        onPlateChange={onPlateChange}
        onStateChange={onStateChange}
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
              <p className="text-sm text-slate-500">Color</p>
              <p className="font-medium">
                {vehicle.exteriorColor || "Not available"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">VIN</p>
              <p className="font-medium">{vehicle.vin || "Not available"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Registered State</p>
              <p className="font-medium">{stateValue}</p>
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
}
