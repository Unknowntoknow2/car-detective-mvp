
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedVinLookup } from "@/components/lookup/UnifiedVinLookup";
import { UnifiedPlateLookup } from "@/components/lookup/UnifiedPlateLookup";
import { ManualLookup } from "@/components/premium/lookup/ManualLookup";

interface PremiumTabsProps {
  showFreeValuation?: boolean;
  onSubmit?: (type: string, value: string, state?: string, data?: any) => void;
}

export const PremiumTabs: React.FC<PremiumTabsProps> = ({
  showFreeValuation = true,
  onSubmit
}) => {
  const handleVinSubmit = (vin: string) => {
    onSubmit?.('vin', vin);
  };

  const handlePlateSubmit = (vehicle: any) => {
    onSubmit?.('plate', vehicle.plate, vehicle.state, vehicle);
  };

  const handleManualSubmit = (data: any) => {
    onSubmit?.('manual', JSON.stringify(data), undefined, data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs defaultValue="vin">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
          <TabsTrigger value="plate">License Plate</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vin" className="space-y-4">
          <UnifiedVinLookup 
            onSubmit={handleVinSubmit}
            tier="premium"
          />
        </TabsContent>
        
        <TabsContent value="plate" className="space-y-4">
          <UnifiedPlateLookup 
            onVehicleFound={handlePlateSubmit}
            tier="premium"
          />
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4">
          <ManualLookup
            onSubmit={handleManualSubmit}
            submitButtonText="Get Premium Valuation"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
