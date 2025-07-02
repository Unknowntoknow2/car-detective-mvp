
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataAggregationDashboard } from '@/components/admin/DataAggregationDashboard';
import FANGOrchestrationDashboard from '@/components/admin/FANGOrchestrationDashboard';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="orchestration" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orchestration">FANG Orchestration</TabsTrigger>
          <TabsTrigger value="aggregation">Data Aggregation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orchestration" className="space-y-6">
          <FANGOrchestrationDashboard />
        </TabsContent>
        
        <TabsContent value="aggregation" className="space-y-6">
          <DataAggregationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
