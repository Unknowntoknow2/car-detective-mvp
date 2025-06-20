
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedVinLookup } from '@/components/lookup/UnifiedVinLookup';
import { UnifiedPlateLookup } from '@/components/lookup/UnifiedPlateLookup';
import UnifiedManualEntryForm from '@/components/lookup/UnifiedManualEntryForm';
import { ManualEntryFormData } from '@/types/manual-entry';

export interface LookupTabsProps {
  defaultTab?: string;
  onSubmit?: (type: string, value: string, state?: string) => void;
}

export const LookupTabs: React.FC<LookupTabsProps> = ({ 
  defaultTab = 'vin',
  onSubmit
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleVinSubmit = (vin: string) => {
    onSubmit?.('vin', vin);
  };

  const handlePlateSubmit = (vehicle: any) => {
    onSubmit?.('plate', vehicle.plate, vehicle.state);
  };

  const handleManualSubmit = (data: ManualEntryFormData) => {
    onSubmit?.('manual', JSON.stringify(data));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
          <TabsTrigger value="plate">License Plate</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vin" className="space-y-4">
          <UnifiedVinLookup onSubmit={handleVinSubmit} />
        </TabsContent>
        
        <TabsContent value="plate" className="space-y-4">
          <UnifiedPlateLookup onVehicleFound={handlePlateSubmit} />
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4">
          <UnifiedManualEntryForm onSubmit={handleManualSubmit} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LookupTabs;
