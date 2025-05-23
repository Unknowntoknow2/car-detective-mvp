
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VinLookup from '@/components/lookup/VinLookup';
import { PlateLookup } from '@/components/lookup/PlateLookup';
import { ManualLookup } from '@/components/lookup/ManualLookup';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { toast } from 'sonner';

interface LookupTabsProps {
  defaultTab?: string;
  onSubmit?: (type: string, value: string, state?: string) => void;
  isSubmitting?: boolean;
}

export function LookupTabs({ 
  defaultTab = "vin",
  onSubmit,
  isSubmitting = false
}: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabChange = (value: string) => {
    console.log(`LOOKUP TABS: Tab changed to ${value}`);
    setActiveTab(value);
  };

  const handleVinSubmit = (vin: string) => {
    console.log(`LOOKUP TABS VIN: Form submitted with VIN: ${vin}`);
    if (onSubmit) {
      onSubmit("vin", vin);
    } else {
      toast.success("VIN lookup submitted successfully");
    }
  };

  const handlePlateSubmit = (plate: string, state: string) => {
    console.log(`LOOKUP TABS PLATE: Form submitted with plate: ${plate} and state: ${state}`);
    if (onSubmit) {
      onSubmit("plate", plate, state);
    } else {
      toast.success("Plate lookup submitted successfully");
    }
  };

  const handleManualSubmit = (data: ManualEntryFormData) => {
    console.log(`LOOKUP TABS MANUAL: Form submitted with data:`, data);
    
    // Convert the form data to a JSON string
    const jsonData = JSON.stringify(data);
    console.log(`LOOKUP TABS MANUAL: Converted to JSON:`, jsonData);
    
    if (onSubmit) {
      onSubmit("manual", jsonData);
    } else {
      toast.success("Manual lookup submitted successfully");
    }
  };

  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN</TabsTrigger>
        <TabsTrigger value="plate">License Plate</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin" className="space-y-4 mt-4">
        <VinLookup 
          onSubmit={handleVinSubmit} 
          isLoading={isSubmitting && activeTab === 'vin'} 
        />
      </TabsContent>
      
      <TabsContent value="plate" className="space-y-4 mt-4">
        <PlateLookup 
          onSubmit={handlePlateSubmit} 
          isLoading={isSubmitting && activeTab === 'plate'} 
        />
      </TabsContent>
      
      <TabsContent value="manual" className="space-y-4 mt-4">
        <ManualLookup 
          onSubmit={handleManualSubmit} 
          isLoading={isSubmitting && activeTab === 'manual'} 
        />
      </TabsContent>
    </Tabs>
  );
}

export default LookupTabs;
