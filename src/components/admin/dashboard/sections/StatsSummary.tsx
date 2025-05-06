
import React from 'react';
import { StatsCard } from '@/components/stats/StatsCard';
import { BarChart, Users, PieChart } from 'lucide-react';
import { AdminAnalytics } from '@/hooks/useAdminAnalytics';

interface StatsSummaryProps {
  data: AdminAnalytics;
}

export function StatsSummary({ data }: StatsSummaryProps) {
  return (
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
  );
}
