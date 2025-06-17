
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VinForm } from '@/components/lookup/VinForm';
import { PlateForm } from '@/components/lookup/PlateForm';
import { ManualForm } from '@/components/lookup/ManualForm';

interface PremiumTabsProps {
  showFreeValuation?: boolean;
  onSubmit?: (type: string, value: string, state?: string, data?: any) => void;
}

export const PremiumTabs: React.FC<PremiumTabsProps> = ({ 
  showFreeValuation = true,
  onSubmit
}) => {
  const [activeTab, setActiveTab] = useState('vin');

  const handleVinSubmit = (vin: string) => {
    onSubmit?.('vin', vin);
  };

  const handlePlateSubmit = (plate: string, state: string) => {
    onSubmit?.('plate', plate, state);
  };

  const handleManualSubmit = (data: any) => {
    onSubmit?.('manual', JSON.stringify(data), undefined, data);
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
          <VinForm onSubmit={handleVinSubmit} />
        </TabsContent>
        
        <TabsContent value="plate" className="space-y-4">
          <PlateForm onSubmit={handlePlateSubmit} />
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4">
          <ManualForm onSubmit={handleManualSubmit} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PremiumTabs;
