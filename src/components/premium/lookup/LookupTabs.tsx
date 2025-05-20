// src/components/premium/lookup/LookupTabs.tsx

<<<<<<< HEAD
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VINLookupForm } from '@/components/lookup/vin/VINLookupForm';
import { PlateLookup } from '@/components/lookup/PlateLookup';
import { ManualLookup } from '@/components/premium/lookup/PremiumManualLookup';
=======
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManualLookup from './ManualLookup'; // default import assumed
import VinDecoderForm from '@/components/lookup/VinDecoderForm'; // ✅ default import!
import PlateDecoderForm from '@/components/lookup/PlateDecoderForm'; // default import assumed
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
>>>>>>> 1f281f57 (Save local changes before pull)

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
  onSubmit?: (type: string, value: string, state?: string) => void;
}

<<<<<<< HEAD
export function LookupTabs({
  lookup,
  onLookupChange,
  formProps,
  onSubmit
}: LookupTabsProps) {
=======
const LookupTabs: React.FC<LookupTabsProps> = ({
  lookup = 'vin',
  onLookupChange,
  formProps = {}
}) => {
  const [activeTab, setActiveTab] = useState<'vin' | 'plate' | 'manual'>(lookup);

  const handleTabChange = (value: string) => {
    const tabValue = value as 'vin' | 'plate' | 'manual';
    setActiveTab(tabValue);
    if (onLookupChange) {
      onLookupChange(tabValue);
    }
  };

>>>>>>> 1f281f57 (Save local changes before pull)
  return (
    <Tabs value={lookup} onValueChange={onLookupChange as (value: string) => void} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN</TabsTrigger>
        <TabsTrigger value="plate">License Plate</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      <TabsContent value="vin" className="mt-4">
        <VINLookupForm
          onSubmit={formProps.onVinLookup || ((vin) => {})}
          isLoading={formProps.isLoading || false}
          submitButtonText={formProps.submitButtonText}
        />
      </TabsContent>
      <TabsContent value="plate" className="mt-4">
        <PlateLookup
          onSubmit={formProps.onPlateLookup || ((plate, state) => {})}
          isLoading={formProps.isLoading || false}
        />
      </TabsContent>
      <TabsContent value="manual" className="mt-4">
        <ManualLookup
          onSubmit={formProps.onSubmit}
          isLoading={formProps.isLoading}
          submitButtonText={formProps.submitButtonText}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LookupTabs;
