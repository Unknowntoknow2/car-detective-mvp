
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedVinLookup } from '@/components/lookup/UnifiedVinLookup';
import { PlateLookupForm } from '@/components/lookup/plate/PlateLookupForm';
import { ManualEntryForm } from '@/components/lookup/manual/ManualEntryForm';

interface LookupTabsProps {
  defaultTab?: 'vin' | 'plate' | 'manual';
}

export const LookupTabs: React.FC<LookupTabsProps> = ({ defaultTab = 'vin' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleVinSubmit = (vin: string) => {
    console.log('LOOKUP TABS VIN: Form submitted with VIN:', vin);
    // The UnifiedVinLookup component will handle navigation internally
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
        <TabsTrigger value="plate">License Plate</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin" className="mt-6">
        <UnifiedVinLookup onSubmit={handleVinSubmit} />
      </TabsContent>
      
      <TabsContent value="plate" className="mt-6">
        <PlateLookupForm />
      </TabsContent>
      
      <TabsContent value="manual" className="mt-6">
        <ManualEntryForm />
      </TabsContent>
    </Tabs>
  );
};
