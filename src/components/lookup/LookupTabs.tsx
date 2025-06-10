import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VinLookup from './vin/VinLookup';
import PlateLookup from './PlateLookup';

export const LookupTabs = () => {
  return (
    <Tabs defaultValue="vin" className="w-full">
      <TabsList>
        <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
        <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
      </TabsList>
      
      <TabsContent value="plate" className="mt-6">
        <PlateLookup
          tier="free"
          onVehicleFound={(data: any) => {
            console.log('Vehicle found:', data);
          }}
        />
      </TabsContent>
      
      <TabsContent value="vin" className="mt-6">
        <VinLookup />
      </TabsContent>
    </Tabs>
  );
};
