
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedVinLookup } from './EnhancedVinLookup';
import { EnhancedPlateLookup } from './EnhancedPlateLookup';
import { PremiumManualLookup } from './PremiumManualLookup';

interface LookupTabsProps {
  lookup: 'vin' | 'plate' | 'manual';
  onLookupChange: (value: 'vin' | 'plate' | 'manual') => void;
  formProps?: any;
}

export function LookupTabs({ lookup, onLookupChange, formProps }: LookupTabsProps) {
  return (
    <Tabs value={lookup} onValueChange={(value) => onLookupChange(value as any)} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
        <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin" className="space-y-4">
        <EnhancedVinLookup />
      </TabsContent>
      
      <TabsContent value="plate" className="space-y-4">
        <EnhancedPlateLookup />
      </TabsContent>
      
      <TabsContent value="manual" className="space-y-4">
        <PremiumManualLookup />
      </TabsContent>
    </Tabs>
  );
}
