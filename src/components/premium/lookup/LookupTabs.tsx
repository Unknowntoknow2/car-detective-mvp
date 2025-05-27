
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedVinLookup } from '@/components/lookup/UnifiedVinLookup';
import { UnifiedPlateLookup } from '@/components/lookup/UnifiedPlateLookup';
import { PremiumManualLookup } from './PremiumManualLookup';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

interface LookupTabsProps {
  lookup: 'vin' | 'plate' | 'manual';
  onLookupChange: (value: 'vin' | 'plate' | 'manual') => void;
  formProps?: {
    onSubmit?: (data: any) => void;
    onVinLookup?: (vin: string) => void;
    onPlateLookup?: (data: { plate: string; state: string; zipCode?: string }) => void;
    isLoading?: boolean;
    submitButtonText?: string;
  };
}

export function LookupTabs({ lookup, onLookupChange, formProps }: LookupTabsProps) {
  const handlePlateSubmit = (plate: string, state: string) => {
    console.log('Premium plate lookup submitted:', plate, state);
    if (formProps?.onPlateLookup) {
      formProps.onPlateLookup({ plate, state });
    } else if (formProps?.onSubmit) {
      formProps.onSubmit({ plate, state });
    }
  };

  const handleVinSubmit = (vin: string) => {
    console.log('Premium VIN lookup submitted:', vin);
    if (formProps?.onVinLookup) {
      formProps.onVinLookup(vin);
    } else if (formProps?.onSubmit) {
      formProps.onSubmit({ vin });
    }
  };

  const handleManualSubmit = (data: ManualEntryFormData) => {
    console.log('Premium manual lookup submitted:', data);
    if (formProps?.onSubmit) {
      formProps.onSubmit(data);
    }
  };

  return (
    <Tabs value={lookup} onValueChange={(value) => onLookupChange(value as any)} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
        <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin" className="space-y-4">
        <UnifiedVinLookup 
          onSubmit={handleVinSubmit}
          showHeader={false}
        />
      </TabsContent>
      
      <TabsContent value="plate" className="space-y-4">
        <UnifiedPlateLookup 
          onSubmit={handlePlateSubmit}
          showHeader={false}
        />
      </TabsContent>
      
      <TabsContent value="manual" className="space-y-4">
        <PremiumManualLookup 
          onSubmit={handleManualSubmit}
          isLoading={formProps?.isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
