
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedPlateLookup } from "@/components/lookup/UnifiedPlateLookup";
import { ManualEntryForm } from "@/components/lookup/manual/ManualEntryForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LookupTabsProps {
  onVehicleFound: (vehicle: any) => void;
  tier?: "free" | "premium";
  defaultTab?: string;
  onSubmit?: (type: string, value: string, state?: string) => Promise<void>;
}

const VinLookupTab: React.FC<{ tier: "free" | "premium"; onSubmit?: (vin: string) => void; isLoading?: boolean }> = ({ 
  tier, 
  onSubmit, 
  isLoading = false 
}) => {
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateVin = (value: string): boolean => {
    const cleanVin = value.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase();
    return cleanVin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(cleanVin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateVin(vin)) {
      setError('Please enter a valid 17-character VIN');
      return;
    }
    
    setError(null);
    onSubmit?.(vin);
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVin(value);
    if (error && validateVin(value)) {
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
        <Input
          id="vin"
          type="text"
          value={vin}
          onChange={handleVinChange}
          placeholder="Enter 17-digit VIN"
          maxLength={17}
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <p className="text-gray-500 text-sm mt-1">
          The VIN is usually found on your dashboard, driver's side door, or registration.
        </p>
      </div>
      
      <Button 
        type="submit" 
        disabled={!vin || vin.length < 17 || isLoading}
        className="w-full"
      >
        {isLoading ? 'Looking up...' : `Look up Vehicle ${tier === 'premium' ? '(Premium)' : ''}`}
      </Button>
    </form>
  );
};

export function LookupTabs({ onVehicleFound, tier = "free", defaultTab = "vin", onSubmit }: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleVinSubmit = async (vin: string) => {
    if (onSubmit) {
      await onSubmit("vin", vin);
    } else {
      onVehicleFound({ vin, type: "vin" });
    }
  };

  const handleManualSubmit = async (data: any) => {
    if (onSubmit) {
      await onSubmit("manual", JSON.stringify(data));
    } else {
      onVehicleFound(data);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
            <TabsTrigger value="plate">License Plate</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vin" className="mt-6">
            <VinLookupTab
              tier={tier}
              onSubmit={handleVinSubmit}
            />
          </TabsContent>
          
          <TabsContent value="plate" className="mt-6">
            <UnifiedPlateLookup
              tier={tier}
              onVehicleFound={onVehicleFound}
            />
          </TabsContent>
          
          <TabsContent value="manual" className="mt-6">
            <ManualEntryForm
              onSubmit={handleManualSubmit}
              tier={tier}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
