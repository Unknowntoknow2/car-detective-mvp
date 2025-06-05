
import React from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { ManualLookup } from "@/components/premium/lookup/ManualLookup";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";

interface ManualEntryTabProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading: boolean;
}

export function ManualEntryTab({ onSubmit, isLoading }: ManualEntryTabProps) {
  return (
    <TabContentWrapper
      title="Manual Vehicle Entry"
      description="Enter your vehicle details manually for a personalized valuation"
    >
      <ManualLookup
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitButtonText="Get Premium Valuation"
        isPremium={true}
      />
    </TabContentWrapper>
  );
}
