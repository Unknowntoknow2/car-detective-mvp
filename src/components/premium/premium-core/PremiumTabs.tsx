
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ManualEntryForm } from "@/components/lookup/manual/ManualEntryForm";
import { UnifiedPlateLookup } from "@/components/lookup/UnifiedPlateLookup";

interface PremiumTabsProps {
  showFreeValuation?: boolean;
  onSubmit?: (type: string, value: string, state?: string, data?: any) => Promise<void>;
}

const PremiumVinLookup: React.FC<{ onSubmit?: (vin: string) => void; isLoading?: boolean }> = ({ 
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
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="premium-vin">Vehicle Identification Number (VIN)</Label>
            <Input
              id="premium-vin"
              type="text"
              value={vin}
              onChange={handleVinChange}
              placeholder="Enter 17-digit VIN"
              maxLength={17}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <p className="text-gray-500 text-sm mt-1">
              Premium features include CARFAX® reports and enhanced accuracy.
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={!vin || vin.length < 17 || isLoading}
            className="w-full"
          >
            {isLoading ? 'Processing Premium Report...' : 'Get Premium Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export function PremiumTabs({ showFreeValuation = true, onSubmit }: PremiumTabsProps) {
  const [activeTab, setActiveTab] = useState("vin");

  const handleVinSubmit = async (vin: string) => {
    if (onSubmit) {
      await onSubmit("vin", vin);
    }
  };

  const handlePlateSubmit = async (data: any) => {
    if (onSubmit) {
      await onSubmit("plate", data.plate, data.state, data);
    }
  };

  const handleManualSubmit = async (data: any) => {
    if (onSubmit) {
      await onSubmit("manual", JSON.stringify(data), undefined, data);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Premium Vehicle Analysis</h3>
          <p className="text-gray-600">Get comprehensive vehicle insights with CARFAX® integration</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vin">VIN Analysis</TabsTrigger>
            <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vin" className="mt-6">
            <PremiumVinLookup onSubmit={handleVinSubmit} />
          </TabsContent>
          
          <TabsContent value="plate" className="mt-6">
            <UnifiedPlateLookup
              tier="premium"
              onVehicleFound={handlePlateSubmit}
              showPremiumFeatures={true}
            />
          </TabsContent>
          
          <TabsContent value="manual" className="mt-6">
            <ManualEntryForm
              onSubmit={handleManualSubmit}
              tier="premium"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
