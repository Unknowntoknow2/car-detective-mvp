
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  totalValuations: number;
  avgConfidenceScore: number;
  topZips: { zip: string; count: number }[];
  revenueTotal: number;
  valuationsByDay: { date: string; count: number }[];
}

export function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get total valuations
      const { count: totalValuations, error: valuationsError } = await supabase
        .from('valuations')
        .select('*', { count: 'exact', head: true });

      if (valuationsError) throw valuationsError;

      // Get average confidence score
      const { data: confidenceData, error: confidenceError } = await supabase
        .from('valuations')
        .select('confidence_score')
        .not('confidence_score', 'is', null);

      if (confidenceError) throw confidenceError;

      const avgConfidenceScore = confidenceData.length > 0
        ? confidenceData.reduce((sum, val) => sum + (val.confidence_score || 0), 0) / confidenceData.length
        : 0;

      // Get top 5 ZIPs by usage
      const { data: zipData, error: zipError } = await supabase
        .from('valuations')
        .select('zip_code:state')
        .not('state', 'is', null);

      if (zipError) throw zipError;

      // Count occurrences of each ZIP
      const zipCounts: { [key: string]: number } = {};
      zipData.forEach(item => {
        const zip = item.zip_code;
        if (zip) {
          zipCounts[zip] = (zipCounts[zip] || 0) + 1;
        }
      });

      // Convert to array and sort by count
      const topZips = Object.entries(zipCounts)
        .map(([zip, count]) => ({ zip, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get revenue from orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('amount')
        .eq('status', 'paid')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (orderError) throw orderError;

      const revenueTotal = orderData.reduce((sum, order) => sum + (order.amount || 0), 0);

      // Get valuations by day (last 7 days)
      const { data: dailyData, error: dailyError } = await supabase
        .from('valuations')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (dailyError) throw dailyError;

      // Group by day
      const dailyCounts: { [key: string]: number } = {};
      dailyData.forEach(item => {
        const date = new Date(item.created_at).toISOString().split('T')[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      });

      // Create array for last 7 days, ensuring all days are included
      const valuationsByDay = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        valuationsByDay.push({
          date,
          count: dailyCounts[date] || 0
        });
      }

      setData({
        totalValuations: totalValuations || 0,
        avgConfidenceScore,
        topZips,
        revenueTotal,
        valuationsByDay
      });
      
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Platform Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Valuations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalValuations.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Confidence Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Math.round(data.avgConfidenceScore)}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">30-Day Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${(data.revenueTotal / 100).toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Top ZIP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.topZips.length > 0 ? data.topZips[0].zip : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Valuations (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.valuationsByDay}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top 5 ZIPs by Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topZips} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="zip" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
