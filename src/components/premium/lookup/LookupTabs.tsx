
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VINLookupForm } from "@/components/lookup/vin/VINLookupForm";
import { PlateLookup } from "@/components/lookup/PlateLookup";
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
        <VINLookupForm
          onSubmit={formProps.onSubmit}
          isLoading={formProps.isLoading || false}
        />
      </TabsContent>
      
      <TabsContent value="plate" className="space-y-4">
        <PlateLookup
          tier="premium"
          onVehicleFound={formProps.onSubmit}
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
