
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import VinLookup from '@/components/lookup/VinLookup';
import PlateLookup from '@/components/lookup/PlateLookup';
import ManualEntryForm from '@/components/lookup/ManualEntryForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LookupTabsProps {
  defaultTab?: string;
  onSubmit?: (type: string, value: string, state?: string) => void;
  isSubmitting?: boolean;
}

export function LookupTabs({ 
  defaultTab = "vin",
  onSubmit,
  isSubmitting = false
}: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleVinSubmit = (vin: string) => {
    if (onSubmit) {
      onSubmit("vin", vin);
      return;
    }

    setIsLoading(true);
    
    // In a real app, you'd call an API here
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to the valuation result page with the VIN
      navigate(`/valuation-followup?vin=${vin}`);
    }, 1500);
  };

  const handlePlateSubmit = (plate: string, state: string) => {
    if (onSubmit) {
      onSubmit("plate", plate, state);
      return;
    }

    setIsLoading(true);
    
    // In a real app, you'd call an API here
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to the valuation result page with the plate info
      navigate(`/valuation-followup?plate=${plate}&state=${state}`);
    }, 1500);
  };

  const handleManualSubmit = (data: any) => {
    if (onSubmit) {
      const jsonData = JSON.stringify(data);
      onSubmit("manual", jsonData);
      return;
    }

    setIsLoading(true);
    
    // In a real app, you'd call an API here
    setTimeout(() => {
      setIsLoading(false);
      
      // Store form data in localStorage or state management
      localStorage.setItem('manual_entry_data', JSON.stringify(data));
      
      // Navigate to the valuation result
      navigate('/valuation-result');
      
      toast.success('Valuation completed successfully!');
    }, 1500);
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="vin">VIN</TabsTrigger>
            <TabsTrigger value="plate">License Plate</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vin" className="space-y-4">
            <VinLookup 
              onSubmit={handleVinSubmit}
              isLoading={isSubmitting ? isSubmitting && activeTab === 'vin' : isLoading}
            />
          </TabsContent>
          
          <TabsContent value="plate" className="space-y-4">
            <PlateLookup 
              onSubmit={handlePlateSubmit}
              isLoading={isSubmitting ? isSubmitting && activeTab === 'plate' : isLoading}
            />
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <ManualEntryForm 
              onSubmit={handleManualSubmit}
              isLoading={isSubmitting ? isSubmitting && activeTab === 'manual' : isLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default LookupTabs;
