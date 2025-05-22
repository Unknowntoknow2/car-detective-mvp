
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumValuationForm } from '@/components/premium/form/PremiumValuationForm';
import VinLookup from '@/components/lookup/VinLookup';
import ManualEntryForm from '@/components/lookup/ManualEntryForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';

export default function PremiumPage() {
  const [activeTab, setActiveTab] = useState('advanced');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleVinSubmit = (vin: string) => {
    setIsLoading(true);
    
    // In a real app, you'd call an API here
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to the premium valuation form with the VIN
      navigate(`/premium/form?vin=${vin}`);
      toast.success('VIN validated successfully!');
    }, 1500);
  };

  const handleManualSubmit = (data: any) => {
    setIsLoading(true);
    
    // In a real app, you'd call an API here
    setTimeout(() => {
      setIsLoading(false);
      
      // Store form data in localStorage or state management
      localStorage.setItem('manual_entry_data', JSON.stringify(data));
      
      // Navigate to the premium form
      navigate('/premium/form', { state: { vehicleData: data } });
      
      toast.success('Vehicle information validated!');
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Premium Valuation</h1>
            <p className="text-muted-foreground mt-2">
              Get a detailed, accurate valuation of your vehicle with our premium service
            </p>
          </div>

          <Tabs defaultValue="advanced" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="advanced">Advanced Form</TabsTrigger>
              <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="advanced" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Valuation Form</CardTitle>
                  <CardDescription>
                    Our most detailed valuation form with condition assessment and feature selection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PremiumValuationForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="vin" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>VIN Lookup</CardTitle>
                  <CardDescription>
                    Enter your Vehicle Identification Number for a quick and accurate valuation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VinLookup 
                    onSubmit={handleVinSubmit}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="manual" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Entry</CardTitle>
                  <CardDescription>
                    Don't have your VIN? Enter your vehicle details manually
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ManualEntryForm 
                    onSubmit={handleManualSubmit}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Premium Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Detailed condition assessment with score breakdown</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Market comparison with similar vehicles in your area</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>12-month price forecast and depreciation analysis</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Customizable features and options for precise valuations</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Printable PDF report with all valuation details</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
