
import React from "react";
import { EnhancedVinLookup } from "@/components/lookup/vin/EnhancedVinLookup";

interface VinLookupProps {
  onSubmit?: (vin: string) => void;
  isLoading?: boolean;
  onVehicleFound?: (vehicle: any) => void;
  showManualFallback?: boolean;
  readonly?: boolean;
}

interface VinLookupTabProps {
  value: string;
  onChange: (value: string) => void;
  onLookup: () => void;
  isLoading: boolean;
}

export function VinLookupTab({ value, onChange, onLookup, isLoading }: VinLookupTabProps) {
  return (
    <div className="space-y-4">
      <EnhancedVinLookup
        onSubmit={onLookup}
        isLoading={isLoading}
      />
    </div>
  );
}
