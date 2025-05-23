
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the dashboard content for improved performance
const DealerDashboardContent = lazy(() => import('@/components/dealer/DealerDashboardContent'));

// Loading state component
const LoadingState = () => (
  <div className="container max-w-5xl mx-auto px-4 py-8">
    <div className="space-y-6">
      <Skeleton className="h-12 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

// Dashboard wrapper with error boundary and suspense
const DealerDashboard = () => {
  return (
    <ErrorBoundary fallback={
      <div className="container p-8">
        <div className="p-6 rounded-lg bg-red-50 border border-red-200 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Dashboard Error</h2>
          <p className="text-red-600 mb-6">
            We encountered an issue loading the dealer dashboard. Please try again or contact support.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="destructive"
          >
            Reload Dashboard
          </Button>
        </div>
      </div>
    }>
      <Suspense fallback={<LoadingState />}>
        <DealerDashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DealerDashboard;
