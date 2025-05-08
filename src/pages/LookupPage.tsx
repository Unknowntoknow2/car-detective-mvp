
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { VINLookupForm } from '@/components/lookup/vin/VINLookupForm';
import PlateDecoderForm from '@/components/lookup/PlateDecoderForm';
import ManualEntryForm from '@/components/lookup/manual/ManualEntryForm';

const LookupPage: React.FC = () => {
  const handleManualSubmit = (data: any) => {
    console.log('Manual form data:', data);
    // Implement submission logic here
  };

  const handleVinSubmit = (vin: string) => {
    console.log('VIN submitted:', vin);
    // Implement VIN submission logic here
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vin">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="vin">VIN</TabsTrigger>
              <TabsTrigger value="plate">License Plate</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            <Separator className="mb-6" />
            
            <TabsContent value="vin">
              <VINLookupForm onSubmit={handleVinSubmit} />
            </TabsContent>
            
            <TabsContent value="plate">
              <PlateDecoderForm />
            </TabsContent>
            
            <TabsContent value="manual">
              <ManualEntryForm onSubmit={handleManualSubmit} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LookupPage;
