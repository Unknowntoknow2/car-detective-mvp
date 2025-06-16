
// src/components/lookup/LookupTabs.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedVinLookup } from "@/components/lookup/UnifiedVinLookup";
import PlateLookup from './PlateLookup';
import { Button } from "@/components/ui/button";

export const LookupTabs = () => {
  const navigate = useNavigate();

  const handleManualEntryClick = () => {
    navigate('/manual-valuation');
  };

  return (
    <Tabs defaultValue="vin" className="w-full">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
        <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>

      <TabsContent value="vin" className="mt-6">
        <UnifiedVinLookup />
      </TabsContent>

      <TabsContent value="plate" className="mt-6">
        <PlateLookup
          tier="free"
          onVehicleFound={(data: any) => {
            console.log("Vehicle found:", data);
            if (data.vin) {
              navigate(`/valuation/${data.vin}`);
            }
          }}
        />
      </TabsContent>

      <TabsContent value="manual" className="mt-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Manual Vehicle Entry</h3>
            <p className="text-sm text-muted-foreground">
              Enter your vehicle details manually for a personalized valuation
            </p>
          </div>
          <Button 
            onClick={handleManualEntryClick}
            size="lg" 
            className="w-full max-w-sm"
          >
            Enter Vehicle Details
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};
