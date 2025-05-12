
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ValuationProvider } from './contexts/ValuationContext';
import { DealerOffersTracker } from './components/dealer/DealerOffersTracker';
import MainLayout from './layouts/MainLayout';
import ValuationDetailPage from './pages/ValuationDetailPage';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import DealerDashboard from './pages/DealerDashboard';
import ViewOfferPage from './pages/view-offer/[token]';
import SharedValuationPage from './pages/share/[token]';
import { EnhancedErrorBoundary } from './components/common/EnhancedErrorBoundary';

// Lazy-loaded components for routes
const LazyDealerInsightsPage = lazy(() => import('./pages/DealerInsightsPage'));

// Loading component for Suspense fallbacks
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

// Initialize the React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ValuationProvider>
            <EnhancedErrorBoundary context="app-root">
              <Routes>
                <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                <Route path="/valuation/:valuationId" element={
                  <MainLayout>
                    <EnhancedErrorBoundary context="valuation-detail">
                      <ValuationDetailPage />
                    </EnhancedErrorBoundary>
                  </MainLayout>
                } />
                <Route path="/auth/*" element={<AuthLayout />} />
                <Route path="/dashboard/*" element={<DashboardLayout />} />
                <Route path="/dealer-dashboard" element={
                  <MainLayout>
                    <EnhancedErrorBoundary context="dealer-dashboard">
                      <DealerDashboard />
                    </EnhancedErrorBoundary>
                  </MainLayout>
                } />
                <Route path="/dealer-insights" element={
                  <MainLayout>
                    <EnhancedErrorBoundary context="dealer-insights">
                      <Suspense fallback={<PageLoader />}>
                        <LazyDealerInsightsPage />
                      </Suspense>
                    </EnhancedErrorBoundary>
                  </MainLayout>
                } />
                <Route path="/view-offer/:token" element={
                  <MainLayout>
                    <EnhancedErrorBoundary context="view-offer">
                      <ViewOfferPage />
                    </EnhancedErrorBoundary>
                  </MainLayout>
                } />
                <Route path="/share/:token" element={
                  <MainLayout>
                    <EnhancedErrorBoundary context="share-valuation">
                      <SharedValuationPage />
                    </EnhancedErrorBoundary>
                  </MainLayout>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              {/* Global notifications components */}
              <Toaster richColors position="top-right" />
              <DealerOffersTracker />
            </EnhancedErrorBoundary>
          </ValuationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
