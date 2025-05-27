
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedVinLookup } from '@/components/lookup/UnifiedVinLookup';
import { UnifiedPlateLookup } from '@/components/lookup/UnifiedPlateLookup';
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';

interface LookupTabsProps {
  defaultTab?: 'vin' | 'plate' | 'manual';
  onSubmit?: (type: string, value: string, state?: string) => void;
}

export const LookupTabs: React.FC<LookupTabsProps> = ({ 
  defaultTab = 'vin',
  onSubmit 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleVinSubmit = (vin: string) => {
    console.log('LOOKUP TABS VIN: Form submitted with VIN:', vin);
    if (onSubmit) {
      onSubmit('vin', vin);
    }
  };

  const handlePlateSubmit = (plate: string, state: string) => {
    console.log('LOOKUP TABS PLATE: Form submitted with plate:', plate, 'state:', state);
    if (onSubmit) {
      onSubmit('plate', plate, state);
    }
  };

  const handleManualSubmit = (data: any) => {
    console.log('LOOKUP TABS MANUAL: Form submitted with data:', data);
    if (onSubmit) {
      onSubmit('manual', JSON.stringify(data));
    }
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
        <UnifiedPlateLookup onSubmit={handlePlateSubmit} />
      </TabsContent>
      
      <TabsContent value="manual" className="mt-6">
        <ManualEntryForm onSubmit={handleManualSubmit} />
      </TabsContent>
    </Tabs>
  );
};
