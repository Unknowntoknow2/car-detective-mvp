
import React from "react";
import { UnifiedLookupTabs } from "@/components/lookup/UnifiedLookupTabs";

interface LookupTabsProps {
  onVehicleFound?: (vehicle: any) => void;
  tier?: "free" | "premium";
  defaultTab?: string;
  onSubmit?: (type: string, value: string, state?: string) => Promise<void>;
}

export function LookupTabs(props: LookupTabsProps) {
  // This is now just a wrapper around the unified component
  // UnifiedLookupTabs doesn't accept these props, so we'll handle the VIN submission internally
  return <UnifiedLookupTabs />;
}
