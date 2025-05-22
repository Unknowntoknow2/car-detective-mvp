
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VinLookup from '@/components/lookup/VinLookup';
import { PlateLookup } from '@/components/lookup/PlateLookup';
import { ManualLookup } from '@/components/lookup/ManualLookup';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { useNavigate } from 'react-router-dom';
import ValuationResult from '@/components/valuation/ValuationResult';
import { Card } from '@/components/ui/card';
import { ValuationEmptyState } from '@/components/valuation/ValuationEmptyState';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    console.log(`LOOKUP TABS: Tab changed to ${value}`);
    setActiveTab(value);
    // Reset any results when changing tabs
    setValuationResult(null);
    setError(null);
  };

  const handleVinSubmit = (vin: string) => {
    console.log('LOOKUP TABS VIN: Form submitted with VIN:', vin);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 35000,
        condition: 'Good',
        estimatedValue: 22500,
        confidenceScore: 85
      };
      
      setValuationResult(mockResult);
      setIsLoading(false);
      
      if (onResultsReady) {
        onResultsReady(mockResult);
      }
    }, 1500);
  };

  const handlePlateSubmit = (plate: string, state: string) => {
    console.log('LOOKUP TABS PLATE: Form submitted with plate:', plate, 'state:', state);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        make: 'Honda',
        model: 'Accord',
        year: 2019,
        mileage: 42000,
        condition: 'Good',
        estimatedValue: 21000,
        confidenceScore: 80
      };
      
      setValuationResult(mockResult);
      setIsLoading(false);
      
      if (onResultsReady) {
        onResultsReady(mockResult);
      }
    }, 1500);
  };

  const handleManualSubmit = (data: ManualEntryFormData) => {
    console.log('LOOKUP TABS MANUAL: Form submitted with data:', data);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        estimatedValue: 20000 + (Math.random() * 5000),
        confidenceScore: 75
      };
      
      setValuationResult(mockResult);
      setIsLoading(false);
      
      if (onResultsReady) {
        onResultsReady(mockResult);
      }
    }, 1500);
  };

  const handleReset = () => {
    setValuationResult(null);
    setError(null);
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
            <VinLookup onSubmit={handleVinSubmit} isLoading={isLoading && activeTab === 'vin'} />
          </TabsContent>
          
          <TabsContent value="plate" className="space-y-4 mt-4">
            <PlateLookup onSubmit={handlePlateSubmit} isLoading={isLoading && activeTab === 'plate'} />
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4 mt-4">
            <ManualLookup onSubmit={handleManualSubmit} isLoading={isLoading && activeTab === 'manual'} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <Card className="p-6">
            {error ? (
              <ValuationEmptyState 
                message={error || "Failed to get valuation. Please try again."} 
                actionLabel="Try Again" 
                onAction={handleReset}
              />
            ) : (
              <ValuationResult 
                data={valuationResult}
                isPremium={false}
                onUpgrade={() => navigate('/premium')}
              />
            )}
          </Card>
          
          <div className="flex justify-center">
            <button 
              onClick={handleReset}
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

export default LookupTabs;
