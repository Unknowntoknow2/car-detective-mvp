
import React from "react";
import { LoadingState as UnifiedLoadingState } from "@/components/common/UnifiedLoadingSystem";

export function LoadingState() {
  return (
    <UnifiedLoadingState 
      message="Loading service history..."
      size="default"
    />
  );
}
