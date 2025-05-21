import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

async function getDashboardStats() {
  try {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

const QADashboardPage = async () => {
  const stats = await getDashboardStats();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">QA Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Valuations</CardTitle>
            <CardDescription>Number of valuations generated</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats?.totalValuations ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unique Users</CardTitle>
            <CardDescription>Number of unique users generating valuations</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats?.uniqueUsers ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PDF Downloads</CardTitle>
            <CardDescription>Number of PDF reports downloaded</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats?.totalPdfs ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Premium Valuations</CardTitle>
            <CardDescription>Number of premium valuations generated</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats?.premiumValuations ?? 0}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QADashboardPage;
