
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LookupTabsProps {
  defaultTab?: string;
}

export const LookupTabs: React.FC<LookupTabsProps> = ({ defaultTab = 'vin' }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab}>
          <TabsList>
            <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
            <TabsTrigger value="plate">License Plate</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="vin">
            <p>VIN lookup form would go here</p>
          </TabsContent>
          <TabsContent value="plate">
            <p>License plate lookup form would go here</p>
          </TabsContent>
          <TabsContent value="manual">
            <p>Manual entry form would go here</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
