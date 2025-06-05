
import React from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { EnhancedPlateLookup } from "@/components/premium/lookup/EnhancedPlateLookup";

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
  plateState,
  isLoading,
  vehicle,
  onPlateChange,
  onStateChange,
  onLookup
}: PlateLookupTabProps) {
  return (
    <TabContentWrapper
      title="License Plate Lookup"
      description="Enter your license plate number for quick vehicle identification"
    >
      <EnhancedPlateLookup
        value={plateValue}
        state={plateState}
        onPlateChange={onPlateChange}
        onStateChange={onStateChange}
        onLookup={onLookup}
        isLoading={isLoading}
        vehicle={vehicle}
      />
    </TabContentWrapper>
  );
}
