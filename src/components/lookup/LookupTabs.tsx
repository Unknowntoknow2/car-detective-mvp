
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedVinLookup } from "@/components/lookup/UnifiedVinLookup";
import { PlateLookup } from './PlateLookup';
import { Button } from "@/components/ui/button";

export const LookupTabs = () => {
  const navigate = useNavigate();

  const handleVinSubmit = (vin: string) => {
    console.log('VIN submitted:', vin);
    navigate(`/valuation/${vin}`);
  };

  const handleVehicleFound = (data: any) => {
    console.log("Vehicle found:", data);
    if (data.vin) {
      navigate(`/valuation/${data.vin}`);
    } else {
      // If no VIN, navigate to manual valuation with pre-filled data
      navigate('/manual-valuation', { state: { vehicleData: data } });
    }
  };

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
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">VIN Lookup</h3>
            <p className="text-sm text-muted-foreground">
              Enter your 17-character VIN for instant vehicle information
            </p>
          </div>
          <UnifiedVinLookup onSubmit={handleVinSubmit} />
        </div>
      </TabsContent>

      <TabsContent value="plate" className="mt-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">License Plate Lookup</h3>
            <p className="text-sm text-muted-foreground">
              Enter your license plate and state for vehicle details
            </p>
          </div>
          <PlateLookup
            tier="free"
            onVehicleFound={handleVehicleFound}
          />
        </div>
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

export default LookupTabs;
