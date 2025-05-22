
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VinLookup from '@/components/lookup/VinLookup';
import { PlateLookup } from '@/components/lookup/PlateLookup';
import { ManualLookup } from '@/components/lookup/ManualLookup';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { useNavigate } from 'react-router-dom';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card } from '@/components/ui/card';

interface LookupTabsProps {
  defaultTab?: string;
  onResultsReady?: (result: any) => void;
}

export function LookupTabs({ 
  defaultTab = "vin",
  onResultsReady
}: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [valuationResult, setValuationResult] = useState<any>(null);
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    console.log(`LOOKUP TABS: Tab changed to ${value}`);
    setActiveTab(value);
    // Reset any results when changing tabs
    setValuationResult(null);
  };

  const handleResultsReady = (result: any) => {
    setValuationResult(result);
    
    if (onResultsReady) {
      onResultsReady(result);
    }
  };

  return (
    <div className="space-y-6">
      {!valuationResult ? (
        <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vin">VIN</TabsTrigger>
            <TabsTrigger value="plate">License Plate</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vin" className="space-y-4 mt-4">
            <VinLookup onResultsReady={handleResultsReady} />
          </TabsContent>
          
          <TabsContent value="plate" className="space-y-4 mt-4">
            <PlateLookup onResultsReady={handleResultsReady} />
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4 mt-4">
            <ManualLookup onResultsReady={handleResultsReady} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <Card className="p-6">
            <ValuationResult 
              data={valuationResult}
              isPremium={false}
            />
          </Card>
          
          <div className="flex justify-center">
            <button 
              onClick={() => setValuationResult(null)}
              className="text-sm text-primary hover:underline"
            >
              Start a new valuation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
