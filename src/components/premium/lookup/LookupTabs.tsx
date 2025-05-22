
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { VINLookupForm } from '@/components/lookup/vin/VINLookupForm';
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { Car, FileText, Search } from 'lucide-react';

interface LookupTabsProps {
  lookup: 'vin' | 'plate' | 'manual';
  onLookupChange: (value: 'vin' | 'plate' | 'manual') => void;
  formProps: {
    onSubmit: (data: any) => void;
    isLoading: boolean;
    submitButtonText?: string;
    onVinLookup?: (vin: string) => void;
    onPlateLookup?: (plate: string, state: string) => void;
  };
}

export function LookupTabs({ 
  lookup, 
  onLookupChange, 
  formProps 
}: LookupTabsProps) {
  return (
    <Tabs 
      value={lookup} 
      onValueChange={(value) => onLookupChange(value as 'vin' | 'plate' | 'manual')}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="vin" className="flex flex-col gap-1 py-3 h-auto">
          <Search className="h-4 w-4" />
          <span className="text-xs font-medium">VIN Lookup</span>
        </TabsTrigger>
        <TabsTrigger value="plate" className="flex flex-col gap-1 py-3 h-auto">
          <Car className="h-4 w-4" />
          <span className="text-xs font-medium">License Plate</span>
        </TabsTrigger>
        <TabsTrigger value="manual" className="flex flex-col gap-1 py-3 h-auto">
          <FileText className="h-4 w-4" />
          <span className="text-xs font-medium">Manual Entry</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin" className="mt-0">
        <Card>
          <CardContent className="pt-6">
            <VINLookupForm 
              onSubmit={formProps.onVinLookup || ((vin) => formProps.onSubmit({ vin }))}
              isLoading={formProps.isLoading}
              submitButtonText={formProps.submitButtonText || "Lookup VIN"}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="plate" className="mt-0">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">
              License plate lookup is not available in this demo.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="manual" className="mt-0">
        <Card>
          <CardContent className="pt-6">
            <ManualEntryForm 
              onSubmit={formProps.onSubmit}
              isLoading={formProps.isLoading}
              submitButtonText={formProps.submitButtonText || "Submit"}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
