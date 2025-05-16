
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VinDecoderForm } from '@/components/lookup/VinDecoderForm';
import PlateDecoderForm from '@/components/lookup/PlateDecoderForm';
import PremiumManualEntryForm from '@/components/lookup/manual/PremiumManualEntryForm';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

export interface LookupTabsProps {
  lookup?: 'vin' | 'plate' | 'manual';
  onLookupChange?: (value: 'vin' | 'plate' | 'manual') => void;
  onSubmit?: (type: string, value: string, state?: string) => void;
  isLoading?: boolean;
  formProps?: {
    onSubmit: (data: ManualEntryFormData) => void;
    isLoading: boolean;
    submitButtonText: string;
    onVinLookup?: (vin: string) => Promise<any>;
    onPlateLookup?: (plate: string, state: string) => Promise<any>;
  };
}

export function LookupTabs({ 
  lookup = 'vin',
  onLookupChange,
  onSubmit,
  isLoading = false,
  formProps
}: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState<'vin' | 'plate' | 'manual'>(lookup);
  
  const handleTabChange = (value: string) => {
    const tabValue = value as 'vin' | 'plate' | 'manual';
    setActiveTab(tabValue);
    if (onLookupChange) {
      onLookupChange(tabValue);
    }
  };
  
  const handleVinSubmit = (vin: string) => {
    console.log("VIN submitted:", vin);
    if (formProps?.onVinLookup) {
      formProps.onVinLookup(vin);
    } else if (onSubmit) {
      onSubmit('vin', vin);
    }
  };
  
  const handlePlateSubmit = (plate: string, state: string) => {
    console.log("Plate submitted:", plate, state);
    if (formProps?.onPlateLookup) {
      formProps.onPlateLookup(plate, state);
    } else if (onSubmit) {
      onSubmit('plate', plate, state);
    }
  };
  
  const handleManualSubmit = (data: ManualEntryFormData) => {
    console.log("Manual data submitted:", data);
    if (formProps?.onSubmit) {
      formProps.onSubmit(data);
    } else if (onSubmit) {
      // Convert the data to a string for consistent handling
      onSubmit('manual', JSON.stringify(data));
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
        <VinDecoderForm onSubmit={handleVinSubmit} />
      </TabsContent>
      
      <TabsContent value="plate" className="mt-4">
        <PlateDecoderForm onSubmit={handlePlateSubmit} />
      </TabsContent>
      
      <TabsContent value="manual" className="mt-4">
        <PremiumManualEntryForm 
          onSubmit={handleManualSubmit}
          isLoading={formProps?.isLoading || isLoading}
          submitButtonText={formProps?.submitButtonText || "Submit for Premium Valuation"}
        />
      </TabsContent>
    </Tabs>
  );
}
