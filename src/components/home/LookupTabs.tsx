
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VinForm } from '@/components/lookup/VinForm';
import { PlateForm } from '@/components/lookup/PlateForm';
import { ManualForm } from '@/components/lookup/ManualForm';

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

  const handlePlateSubmit = (plate: string, state: string) => {
    onSubmit?.('plate', plate, state);
  };

  const handleManualSubmit = (data: any) => {
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
          <div className="bg-white p-6 rounded-lg border">
            <VinForm onSubmit={handleVinSubmit} />
          </div>
        </TabsContent>
        
        <TabsContent value="plate" className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <PlateForm onSubmit={handlePlateSubmit} />
          </div>
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <ManualForm onSubmit={handleManualSubmit} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LookupTabs;
