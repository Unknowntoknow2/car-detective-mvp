
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { StatsCard } from '@/components/stats/StatsCard';
import { AdminAnalyticsChart } from '@/components/admin/AdminAnalyticsChart';
import { ChartContainer } from '@/components/ui/chart';
import { Loader2, Users, Calendar, BarChart, MapPin, PieChart } from 'lucide-react';
import { LeaderboardRow } from '@/components/stats/LeaderboardRow';

export function AdminAnalyticsDashboard() {
  const { data, isLoading, error } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-destructive/10 rounded-lg text-center">
        <h3 className="text-lg font-medium text-destructive mb-2">Error Loading Analytics</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 bg-muted rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">No Data Available</h3>
        <p className="text-muted-foreground">Analytics data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Valuations" 
          value={data.totalValuations} 
          icon={<BarChart />}
          trend={data.totalValuations > 0 ? { value: 12, isPositive: true, label: "vs last month" } : undefined}
        />
        <StatsCard 
          title="Premium Conversions" 
          value={data.revenueTotal / 100} 
          formatter={(val) => `$${val.toLocaleString()}`}
          icon={<Users />}
          trend={data.revenueTotal > 0 ? { value: 8, isPositive: true, label: "vs last month" } : undefined} 
        />
        <StatsCard 
          title="Active Users" 
          value={data.totalValuations * 0.8} // Placeholder estimate
          icon={<Users />}
        />
        <StatsCard 
          title="Avg Confidence Score" 
          value={data.aiConfidence} 
          formatter={(val) => `${Math.round(val)}%`}
          icon={<PieChart />}
          trend={data.aiConfidence > 0 ? { value: 5, isPositive: true, label: "improvement" } : undefined}
        />
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Top ZIP Codes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.topZipCodes.map((item, index) => (
                <LeaderboardRow
                  key={item.zip}
                  rank={index + 1}
                  title={item.zip}
                  subtitle={`${item.count} valuations`}
                  value={`${((item.count / data.totalValuations) * 100).toFixed(1)}%`}
                  highlight={index === 0}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Recent Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.latestPayments.map((payment, index) => (
                <div key={payment.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">${(payment.amount / 100).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
