
import React, { useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumValuationForm } from '@/components/premium/form/PremiumValuationForm';
import { EnhancedVinLookup } from '@/components/premium/lookup/EnhancedVinLookup';
import { EnhancedPlateLookup } from '@/components/premium/lookup/EnhancedPlateLookup';
import { PremiumManualLookup } from '@/components/premium/lookup/PremiumManualLookup';
import { PremiumHero } from '@/components/premium/hero/PremiumHero';
import { toast } from 'sonner';

export default function PremiumPage() {
  const formRef = useRef<HTMLDivElement>(null);
  
  // Define a handler for plate lookup submissions
  const handlePlateLookupSubmit = (data: { plate: string; state: string; zipCode: string }) => {
    console.log('Plate lookup submitted:', data);
    toast.success('Plate lookup submitted successfully');
    // Additional processing would go here
  };

  // Define a handler for VIN lookup submissions
  const handleVinLookupSubmit = (vin: string) => {
    console.log('VIN lookup submitted:', vin);
    toast.success('VIN lookup submitted successfully');
    // Additional processing would go here
  };

  // Define a handler for manual lookup submissions
  const handleManualLookupSubmit = (data: any) => {
    console.log('Manual lookup submitted:', data);
    toast.success('Manual lookup submitted successfully');
    // Additional processing would go here
  };

  // Function to scroll to the premium form
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <Container className="py-8 px-4 md:px-6">
        <PremiumHero scrollToForm={scrollToForm} />
        
        <div className="mt-8" ref={formRef}>
          <Card className="p-6">
            <Tabs defaultValue="vin" className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-6">
                <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
                <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="photo" className="hidden md:block">Photo Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vin" className="space-y-4">
                <EnhancedVinLookup onSubmit={handleVinLookupSubmit} />
              </TabsContent>
              
              <TabsContent value="plate" className="space-y-4">
                <EnhancedPlateLookup onSubmit={handlePlateLookupSubmit} />
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4">
                <PremiumManualLookup onSubmit={handleManualLookupSubmit} />
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
      </Container>
    </MainLayout>
  );
}
