
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VinLookupForm } from '@/components/lookup/vin/VINLookupForm';
import { PlateLookup } from '@/components/lookup/PlateLookup';
import { ManualLookup } from '@/components/premium/lookup/PremiumManualLookup';

interface LookupTabsProps {
  lookup: 'vin' | 'plate' | 'manual';
  onLookupChange: (value: 'vin' | 'plate' | 'manual') => void;
  formProps: {
    onSubmit: (data: any) => void;
    isLoading?: boolean;
    submitButtonText?: string;
    onVinLookup?: (vin: string) => void;
    onPlateLookup?: (plate: string, state: string) => void;
  };
}

export function LookupTabs({
  lookup,
  onLookupChange,
  formProps
}: LookupTabsProps) {
  return (
    <Tabs value={lookup} onValueChange={onLookupChange as (value: string) => void} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN</TabsTrigger>
        <TabsTrigger value="plate">License Plate</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin" className="mt-4">
        <VinLookupForm
          onSubmit={formProps.onVinLookup || ((vin) => {})}
          isLoading={formProps.isLoading}
          submitButtonText={formProps.submitButtonText}
        />
      </TabsContent>
      
      <TabsContent value="plate" className="mt-4">
        <PlateLookup
          onSubmit={formProps.onPlateLookup || ((plate, state) => {})}
          isLoading={formProps.isLoading}
          submitButtonText={formProps.submitButtonText}
        />
      </TabsContent>
      
      <TabsContent value="manual" className="mt-4">
        <ManualLookup
          onSubmit={formProps.onSubmit}
          isLoading={formProps.isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
