import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdjustmentHeatmap } from '@/components/admin/heatmap/AdjustmentHeatmap';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, TrendingUp, MapPin } from 'lucide-react';

export default function ValuationInsightsPage() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Valuation Insights Dashboard</h1>
          <p className="text-muted-foreground">
            Advanced analytics and adjustment patterns across all valuations
          </p>
        </div>
      </div>

      <Tabs defaultValue="heatmap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Adjustment Heatmap
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market Trends
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Model Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap">
          <AdjustmentHeatmap />
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Market trends analysis coming soon...</p>
                <p className="text-sm">This will show pricing trends over time, seasonal patterns, and market shifts.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Model performance metrics coming soon...</p>
                <p className="text-sm">This will show valuation accuracy, confidence distributions, and feedback analysis.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}