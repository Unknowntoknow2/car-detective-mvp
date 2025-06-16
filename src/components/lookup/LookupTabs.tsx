// src/components/lookup/LookupTabs.tsx

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedVinLookup } from "@/components/lookup/UnifiedVinLookup";
import PlateLookup from './PlateLookup';

export const LookupTabs = () => {
  return (
    <Tabs defaultValue="vin" className="w-full">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
        <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
      </TabsList>

      <TabsContent value="vin" className="mt-6">
        <UnifiedVinLookup />
      </TabsContent>

      <TabsContent value="plate" className="mt-6">
        <PlateLookup
          tier="free"
          onVehicleFound={(data: any) => {
            console.log("Vehicle found:", data);
          }}
        />
      </TabsContent>
    </Tabs>
  );
};
