
import React from 'react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { AdminLoadingState } from './states/AdminLoadingState';
import { AdminErrorState } from './states/AdminErrorState';
import { AdminEmptyState } from './states/AdminEmptyState';
import { StatsSummary } from './sections/StatsSummary';
import { ChartSection } from './sections/ChartSection';
import { TopZipCodesCard } from './sections/TopZipCodesCard';
import { RecentPaymentsCard } from './sections/RecentPaymentsCard';

export function AdminAnalyticsDashboard() {
  const { data, isLoading, error } = useAdminAnalytics();

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (error) {
    return <AdminErrorState error={error} />;
  }

  if (!data) {
    return <AdminEmptyState />;
  }

  return (
    <div className="space-y-8">
      <StatsSummary data={data} />
      <ChartSection data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopZipCodesCard zipCodes={data.topZipCodes} totalValuations={data.totalValuations} />
        <RecentPaymentsCard payments={data.latestPayments} />
      </div>
    </div>
  );
}
