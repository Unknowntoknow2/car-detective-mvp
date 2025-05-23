
import React, { useRef, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumValuationForm } from '@/components/premium/form/PremiumValuationForm';
import { EnhancedVinLookup } from '@/components/premium/lookup/EnhancedVinLookup';
import { EnhancedPlateLookup } from '@/components/premium/lookup/EnhancedPlateLookup';
import { PremiumManualLookup } from '@/components/premium/lookup/PremiumManualLookup';
import { PremiumHero } from '@/components/premium/hero/PremiumHero';
import { ComparisonSection } from '@/components/premium/ComparisonSection';
import { PremiumTabs } from '@/components/premium/PremiumTabs';
import { TabNavigation } from '@/components/premium/sections/valuation-tabs/TabNavigation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ValuationServiceId } from '@/components/premium/sections/valuation-tabs/services';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';

export default function PremiumPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const valuationFormRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<ValuationServiceId>('vin');
  const [vehicle, setVehicle] = useState<any>(null);
  const navigate = useNavigate();
  const { lookupVehicle, isLoading } = useVehicleLookup();
  
  // Define a handler for plate lookup submissions
  const handlePlateLookupSubmit = async (data: { plate: string; state: string; zipCode: string }) => {
    try {
      const result = await lookupVehicle('plate', data.plate, data.state);
      if (result) {
        setVehicle(result);
        toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
        scrollToValuationForm();
      }
    } catch (error) {
      console.error('Plate lookup error:', error);
      toast.error('Failed to lookup license plate');
    }
  };

  // Define a handler for VIN lookup submissions
  const handleVinLookupSubmit = async (vin: string) => {
    try {
      const result = await lookupVehicle('vin', vin);
      if (result) {
        setVehicle(result);
        toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
        scrollToValuationForm();
      }
    } catch (error) {
      console.error('VIN lookup error:', error);
      toast.error('Failed to lookup VIN');
    }
  };

  // Define a handler for manual lookup submissions
  const handleManualLookupSubmit = async (data: any) => {
    try {
      const result = await lookupVehicle('manual', 'manual-entry', undefined, data);
      if (result) {
        setVehicle(result);
        toast.success(`Added: ${data.year} ${data.make} ${data.model}`);
        scrollToValuationForm();
      }
    } catch (error) {
      console.error('Manual lookup error:', error);
      toast.error('Failed to add vehicle details');
    }
  };

  // Function to scroll to the premium form
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Function to scroll to the valuation form after lookup
  const scrollToValuationForm = () => {
    valuationFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabChange = (tab: ValuationServiceId) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout>
      <Container className="py-8 px-4 md:px-6">
        <PremiumHero scrollToForm={scrollToForm} />
        
        <div className="mt-16" ref={formRef}>
          <Card className="p-6">
            <Tabs defaultValue="vin" className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-6">
                <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
                <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="photo" className="hidden md:block">Photo Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vin" className="space-y-4">
                <EnhancedVinLookup onSubmit={handleVinLookupSubmit} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="plate" className="space-y-4">
                <EnhancedPlateLookup onSubmit={handlePlateLookupSubmit} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4">
                <PremiumManualLookup onSubmit={handleManualLookupSubmit} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="photo" className="space-y-4">
                <div className="text-center p-8">
                  <h3 className="text-lg font-medium mb-2">Photo Upload Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Our AI-powered photo recognition system is currently in development.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {vehicle && (
          <div className="mt-8" ref={valuationFormRef}>
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim && `(${vehicle.trim})`}
              </h2>
              
              <Tabs defaultValue="details" className="w-full">
                <TabNavigation 
                  activeTab={activeTab} 
                  onTabChange={handleTabChange}
                />
                
                <div className="mt-6">
                  <PremiumValuationForm 
                    vehicle={vehicle}
                    onComplete={(valuationId) => {
                      toast.success("Valuation completed!");
                      navigate(`/premium-results/${valuationId}`);
                    }}
                  />
                </div>
              </Tabs>
            </Card>
          </div>
        )}
        
        <div className="mt-16">
          <ComparisonSection scrollToForm={scrollToForm} />
        </div>
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Valuation Package</h2>
          <PremiumTabs 
            showFreeValuation={true}
            onSubmit={(type) => {
              if (type === 'premium') {
                scrollToForm();
              } else {
                navigate('/valuation');
              }
            }}
          />
        </div>
      </Container>
    </MainLayout>
  );
}
