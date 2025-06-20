
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ManualEntryForm } from "@/components/lookup/manual/ManualEntryForm";
import { UnifiedPlateLookup } from "@/components/lookup/UnifiedPlateLookup";
import { LoadingButton } from "@/components/common/UnifiedLoadingSystem";
import { Shield, Star } from "lucide-react";

interface UnifiedLookupTabsProps {
  onVehicleFound: (vehicle: any) => void;
  tier?: "free" | "premium";
  defaultTab?: string;
  onSubmit?: (type: string, value: string, state?: string) => Promise<void>;
  isPremium?: boolean;
}

const VinLookupTab: React.FC<{
  tier: "free" | "premium";
  onSubmit?: (vin: string) => void;
  isLoading?: boolean;
  isPremium?: boolean;
}> = ({ tier, onSubmit, isLoading = false, isPremium = false }) => {
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
    <div className="space-y-4">
      {isPremium && tier === "premium" && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              Premium Features
            </Badge>
          </div>
          <p className="text-sm text-blue-700">
            Enhanced accuracy, CARFAX® integration, and detailed history reports included.
          </p>
        </div>
      )}

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
            {tier === "premium" 
              ? "Premium VIN lookup includes enhanced data sources and verification."
              : "The VIN is usually found on your dashboard, driver's side door, or registration."
            }
          </p>
        </div>
        
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText={tier === "premium" ? "Processing Premium Report..." : "Looking up..."}
          className="w-full"
          disabled={!vin || vin.length < 17}
        >
          {tier === "premium" ? "Get Premium Report" : `Look up Vehicle`}
          {tier === "premium" && <Star className="ml-2 h-4 w-4" />}
        </LoadingButton>
      </form>
    </div>
  );
};

export function UnifiedLookupTabs({ 
  onVehicleFound, 
  tier = "free", 
  defaultTab = "vin", 
  onSubmit,
  isPremium = false 
}: UnifiedLookupTabsProps) {
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

  const shouldShowPremiumFeatures = tier === "premium" || isPremium;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        {shouldShowPremiumFeatures && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Premium Vehicle Analysis</h3>
            <p className="text-gray-600">Get comprehensive vehicle insights with enhanced data sources</p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vin">
              VIN {shouldShowPremiumFeatures && "Analysis"}
            </TabsTrigger>
            <TabsTrigger value="plate">License Plate</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vin" className="mt-6">
            <VinLookupTab
              tier={tier}
              onSubmit={handleVinSubmit}
              isPremium={isPremium}
            />
          </TabsContent>
          
          <TabsContent value="plate" className="mt-6">
            <UnifiedPlateLookup
              tier={tier}
              onVehicleFound={onVehicleFound}
              showPremiumFeatures={shouldShowPremiumFeatures}
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
