
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarIcon, FuelIcon, SettingsIcon, Lock } from "lucide-react";
import type { DecodedVehicleInfo } from "@/types/vehicle";

/**
 * ⚠️ LOCKED COMPONENT - DO NOT MODIFY ⚠️
 * This component is locked and should not be modified.
 * All functionality is working correctly and has been protected.
 */

type FoundCarCardProps = {
  vehicle: DecodedVehicleInfo;
  readonly?: boolean;
};

const FoundCarCard: React.FC<FoundCarCardProps> = ({ vehicle, readonly = true }) => {
  const {
    vin,
    year,
    make,
    model,
    trim,
    bodyType,
    fuelType,
    transmission,
  } = vehicle;
  const title = [year, make, model, trim].filter(Boolean).join(" ");

  // PROTECTION: This component is locked and read-only
  if (!readonly) {
    console.warn("FoundCarCard: Component is locked for modifications");
  }

  return (
    <Card className="p-6 shadow-md border border-gray-200 max-w-xl mx-auto relative">
      {/* Lock indicator */}
      <div className="absolute top-2 right-2 text-gray-400">
        <Lock className="w-4 h-4" />
      </div>
      
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 mb-1">
          {title}
        </CardTitle>
        <div className="text-xs text-gray-500 mb-2">
          VIN: <span className="font-mono">{vin}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {bodyType && (
            <div className="flex items-center gap-2 text-gray-700">
              <CarIcon className="w-5 h-5 text-blue-600" />
              <span>
                <strong>Body Type:</strong> {bodyType}
              </span>
            </div>
          )}
          {fuelType && (
            <div className="flex items-center gap-2 text-gray-700">
              <FuelIcon className="w-5 h-5 text-green-600" />
              <span>
                <strong>Fuel Type:</strong> {fuelType}
              </span>
            </div>
          )}
          {transmission && (
            <div className="flex items-center gap-2 text-gray-700">
              <SettingsIcon className="w-5 h-5 text-gray-700" />
              <span>
                <strong>Transmission:</strong> {transmission}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoundCarCard;
export { FoundCarCard };
export type { FoundCarCardProps };
