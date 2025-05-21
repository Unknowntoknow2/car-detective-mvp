
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContent } from "./valuation-tabs/TabContent";
import { ValuationServiceId, services } from "./valuation-tabs/services";
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { useToast } from '@/components/ui/use-toast';
import { useFeatureCalculator } from '@/hooks/useFeatureCalculator';

export function PremiumValuationTabs() {
  const [activeTab, setActiveTab] = useState<ValuationServiceId>('vin');
  const [vinValue, setVinValue] = useState('');
  const [plateValue, setPlateValue] = useState('');
  const [plateState, setPlateState] = useState('');
  const {
    isLoading,
    error,
    vehicle,
    lookupByVin,
    lookupByPlate,
    lookupVehicle,
    reset
  } = useVehicleLookup();
  const { toast } = useToast();
  
  const [baseEstimate, setBaseEstimate] = useState(0);
  
  // Calculate premium features effect if we have vehicle data
  const selectedFeatures = vehicle?.features || [];
  const { totalAdjustment, percentageOfBase } = useFeatureCalculator(
    selectedFeatures,
    baseEstimate
  );

  useEffect(() => {
    // Set a base estimate for the vehicle if we have data
    if (vehicle) {
      // In a real app, this would come from an API or calculation
      setBaseEstimate(vehicle.year ? (vehicle.year * 1000) : 20000);
    } else {
      setBaseEstimate(0);
    }
  }, [vehicle]);

  const handleVinLookup = async () => {
    if (!vinValue || vinValue.length !== 17) {
      toast({
        description: "Invalid VIN. Please enter a valid 17-character VIN number",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await lookupByVin(vinValue);
      if (!result) {
        toast({
          description: "No vehicle information found for this VIN",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        description: "Failed to retrieve vehicle data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePlateLookup = async () => {
    if (!plateValue) {
      toast({
        description: "Please enter a license plate number",
        variant: "destructive"
      });
      return;
    }
    
    if (!plateState) {
      toast({
        description: "Please select a state for the license plate",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await lookupByPlate(plateValue, plateState);
      if (!result) {
        toast({
          description: "No vehicle information found for this license plate",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        description: "Failed to retrieve vehicle data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleManualSubmit = async (data: any) => {
    // Process manual vehicle data
    // This would typically call an API or create a valuation
    console.log("Manual vehicle data:", data);
    
    // Simulate a lookup with manual data
    lookupVehicle('manual', 'manual-entry', undefined, data);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as ValuationServiceId);
    
    // Reset vehicle data when switching between tabs
    if (value === 'vin' || value === 'plate' || value === 'manual') {
      reset();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="vin" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          {services.map((service) => (
            <TabsTrigger
              key={service.id}
              value={service.id}
              disabled={service.premium && !vehicle}
              className="flex flex-col gap-1 py-3 h-auto"
            >
              {service.icon}
              <span className="text-xs font-medium">{service.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          vinValue={vinValue}
          plateValue={plateValue}
          plateState={plateState}
          isLoading={isLoading}
          vehicle={vehicle}
          onVinChange={setVinValue}
          onPlateChange={setPlateValue}
          onStateChange={setPlateState}
          onVinLookup={handleVinLookup}
          onPlateLookup={handlePlateLookup}
          onManualSubmit={handleManualSubmit}
        />
      </Tabs>
      
      {vehicle && (
        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Premium Features Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Base Value:</p>
              <p className="font-medium">${baseEstimate.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Feature Adjustment:</p>
              <p className="font-medium text-primary">
                + ${totalAdjustment.toLocaleString()} 
                <span className="text-xs text-muted-foreground ml-1">
                  ({percentageOfBase.toFixed(1)}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
