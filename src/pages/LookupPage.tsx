
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { VinLookupForm } from '@/components/lookup/vin/VinLookupForm';
import PlateDecoderForm from '@/components/lookup/PlateDecoderForm';
import ManualEntryForm from '@/components/lookup/ManualEntryForm';

const LookupPage: React.FC = () => {
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
              <VinLookupForm />
            </TabsContent>
            
            <TabsContent value="plate">
              <PlateDecoderForm />
            </TabsContent>
            
            <TabsContent value="manual">
              <ManualEntryForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LookupPage;
