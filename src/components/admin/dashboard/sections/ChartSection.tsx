
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { AdminAnalyticsChart } from '@/components/admin/AdminAnalyticsChart';
import { AdminAnalytics } from '@/hooks/useAdminAnalytics';

interface ChartSectionProps {
  data: AdminAnalytics;
}

export function ChartSection({ data }: ChartSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Daily Valuations</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <ChartContainer 
              config={{ 
                valuations: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
              }}
            >
              <AdminAnalyticsChart 
                title="Daily Valuations" 
                data={data.dailyValuations} 
                type="line" 
                dataKey="count" 
                xAxisKey="date" 
              />
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Valuation by Method</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <ChartContainer 
              config={{ 
                vin: { theme: { light: '#8b5cf6', dark: '#a78bfa' } },
                plate: { theme: { light: '#10b981', dark: '#34d399' } },
                manual: { theme: { light: '#f59e0b', dark: '#fbbf24' } }, 
              }}
            >
              <AdminAnalyticsChart 
                title="Valuations by Method" 
                data={data.valuationsByMethod} 
                type="pie" 
                dataKey="value" 
                nameKey="name" 
              />
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
