
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualLookup } from './ManualLookup';
import { VinDecoderForm } from '@/components/lookup/VinDecoderForm';
import PlateDecoderForm from '@/components/lookup/PlateDecoderForm';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

export interface LookupTabsProps {
  lookup?: 'vin' | 'plate' | 'manual';
  onLookupChange?: (value: 'vin' | 'plate' | 'manual') => void;
  formProps?: {
    onSubmit?: (data: ManualEntryFormData) => void;
    isLoading?: boolean;
    submitButtonText?: string;
    onVinLookup?: (vin: string) => void;
    onPlateLookup?: (plate: string, state: string) => void;
  };
}

export function LookupTabs({ 
  lookup = 'vin',
  onLookupChange,
  formProps = {}
}: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState<'vin' | 'plate' | 'manual'>(lookup);
  
  const handleTabChange = (value: string) => {
    const tabValue = value as 'vin' | 'plate' | 'manual';
    setActiveTab(tabValue);
    if (onLookupChange) {
      onLookupChange(tabValue);
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN</TabsTrigger>
        <TabsTrigger value="plate">License Plate</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin" className="mt-4">
        <VinDecoderForm onSubmit={formProps.onVinLookup} />
      </TabsContent>
      
      <TabsContent value="plate" className="mt-4">
        <PlateDecoderForm onSubmit={formProps.onPlateLookup} />
      </TabsContent>
      
      <TabsContent value="manual" className="mt-4">
        <ManualLookup
          onSubmit={formProps.onSubmit || (() => {})}
          isLoading={formProps.isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
