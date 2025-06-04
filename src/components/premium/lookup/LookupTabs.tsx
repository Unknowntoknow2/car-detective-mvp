<<<<<<< HEAD

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedVinLookup } from './EnhancedVinLookup';
import { EnhancedPlateLookup } from './EnhancedPlateLookup';
import { PremiumManualLookup } from './PremiumManualLookup';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

interface LookupTabsProps {
  lookup: 'vin' | 'plate' | 'manual';
  onLookupChange: (value: 'vin' | 'plate' | 'manual') => void;
  formProps?: {
    onSubmit?: (data: any) => void;
    onVinLookup?: (vin: string) => void;
    onPlateLookup?: (data: { plate: string; state: string; zipCode: string }) => void;
=======
// src/components/premium/lookup/LookupTabs.tsx

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VINLookupForm } from "@/components/lookup/vin/VINLookupForm";
import { PlateLookup } from "@/components/lookup/PlateLookup";
import { ManualLookup } from "@/components/premium/lookup/PremiumManualLookup";

interface LookupTabsProps {
  lookup: "vin" | "plate" | "manual";
  onLookupChange: (value: "vin" | "plate" | "manual") => void;
  formProps: {
    onSubmit: (data: any) => void;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    isLoading?: boolean;
    submitButtonText?: string;
  };
}

<<<<<<< HEAD
export function LookupTabs({ lookup, onLookupChange, formProps }: LookupTabsProps) {
  // Define handlers for each type of lookup
  const handlePlateSubmit = (data: { plate: string; state: string; zipCode: string }) => {
    console.log('Plate lookup submitted:', data);
    // Pass to formProps.onPlateLookup if available
    if (formProps?.onPlateLookup) {
      formProps.onPlateLookup(data);
    } else if (formProps?.onSubmit) {
      formProps.onSubmit(data);
    }
  };

  const handleVinSubmit = (vin: string) => {
    console.log('VIN lookup submitted:', vin);
    // Pass to formProps.onVinLookup if available
    if (formProps?.onVinLookup) {
      formProps.onVinLookup(vin);
    } else if (formProps?.onSubmit) {
      formProps.onSubmit({ vin });
    }
  };

  const handleManualSubmit = (data: ManualEntryFormData) => {
    console.log('Manual lookup submitted:', data);
    // Pass to formProps.onSubmit if available
    if (formProps?.onSubmit) {
      formProps.onSubmit(data);
    }
  };

  return (
    <Tabs value={lookup} onValueChange={(value) => onLookupChange(value as any)} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
        <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
=======
export function LookupTabs({
  lookup,
  onLookupChange,
  formProps,
  onSubmit,
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin" className="space-y-4">
        <EnhancedVinLookup 
          onSubmit={handleVinSubmit} 
          isLoading={formProps?.isLoading}
        />
      </TabsContent>
      
      <TabsContent value="plate" className="space-y-4">
        <EnhancedPlateLookup 
          onSubmit={handlePlateSubmit}
          isLoading={formProps?.isLoading}
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
