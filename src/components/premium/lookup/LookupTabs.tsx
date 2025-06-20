
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedVinLookup } from "@/components/lookup/UnifiedVinLookup";
import { UnifiedPlateLookup } from "@/components/lookup/UnifiedPlateLookup";
import { ManualLookup } from "@/components/premium/lookup/ManualLookup";

interface LookupTabsProps {
  lookup: "vin" | "plate" | "manual";
  onLookupChange: (value: "vin" | "plate" | "manual") => void;
  formProps: {
    onSubmit: (data: any) => void;
    isLoading?: boolean;
    submitButtonText?: string;
  };
}

export function LookupTabs({
  lookup,
  onLookupChange,
  formProps,
}: LookupTabsProps) {
  return (
    <Tabs
      value={lookup}
      onValueChange={onLookupChange as (value: string) => void}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN</TabsTrigger>
        <TabsTrigger value="plate">License Plate</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin" className="space-y-4">
        <UnifiedVinLookup
          onSubmit={(vin: string) => formProps.onSubmit({ vin })}
          isLoading={formProps.isLoading || false}
          tier="premium"
        />
      </TabsContent>
      
      <TabsContent value="plate" className="space-y-4">
        <UnifiedPlateLookup
          tier="premium"
          onVehicleFound={(data: any) => formProps.onSubmit(data)}
        />
      </TabsContent>
      
      <TabsContent value="manual" className="space-y-4">
        <ManualLookup
          onSubmit={formProps.onSubmit}
          isLoading={formProps.isLoading || false}
          submitButtonText={formProps.submitButtonText || "Continue"}
        />
      </TabsContent>
    </Tabs>
  );
}
