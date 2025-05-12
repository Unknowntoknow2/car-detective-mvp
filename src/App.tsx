
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
import NotFound from './pages/NotFound';

// Lazy-loaded components for routes
const LazyDealerInsightsPage = lazy(() => import('./pages/DealerInsightsPage'));
const LazyPremiumPage = lazy(() => import('./pages/PremiumPage'));
const LazyPaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const LazyPaymentCancelledPage = lazy(() => import('./pages/PaymentCancelledPage'));

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

// Define the route configuration for validation
export const appRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/valuation/:valuationId', element: <ValuationDetailPage /> },
  { path: '/auth/*', element: <AuthLayout /> },
  { path: '/dashboard/*', element: <DashboardLayout /> },
  { path: '/dealer-dashboard', element: <DealerDashboard /> },
  { path: '/dealer-insights', element: <LazyDealerInsightsPage /> },
  { path: '/premium', element: <LazyPremiumPage /> },
  { path: '/view-offer/:token', element: <ViewOfferPage /> },
  { path: '/share/:token', element: <SharedValuationPage /> },
  { path: '/payment/success', element: <LazyPaymentSuccessPage /> },
  { path: '/payment/cancelled', element: <LazyPaymentCancelledPage /> },
  { path: '*', element: <NotFound /> }
];

function App() {
  // Wrap all routes with error boundary to prevent crashes
  const wrapWithErrorBoundary = (Component: React.ReactNode, context: string) => (
    <EnhancedErrorBoundary context={context}>
      <Component />
    </EnhancedErrorBoundary>
  );

  // Wrap lazy-loaded components with Suspense
  const wrapWithSuspense = (Component: React.ReactNode) => (
    <Suspense fallback={<PageLoader />}>
      {Component}
    </Suspense>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ValuationProvider>
            <EnhancedErrorBoundary context="app-root">
              <Routes>
                <Route path="/" element={<MainLayout>{wrapWithErrorBoundary(<HomePage />, "home-page")}</MainLayout>} />
                <Route path="/valuation/:valuationId" element={
                  <MainLayout>
                    {wrapWithErrorBoundary(<ValuationDetailPage />, "valuation-detail")}
                  </MainLayout>
                } />
                <Route path="/auth/*" element={<AuthLayout />} />
                <Route path="/dashboard/*" element={<DashboardLayout />} />
                <Route path="/dealer-dashboard" element={
                  <MainLayout>
                    {wrapWithErrorBoundary(<DealerDashboard />, "dealer-dashboard")}
                  </MainLayout>
                } />
                <Route path="/dealer-insights" element={
                  <MainLayout>
                    {wrapWithErrorBoundary(
                      wrapWithSuspense(<LazyDealerInsightsPage />),
                      "dealer-insights"
                    )}
                  </MainLayout>
                } />
                <Route path="/premium" element={
                  <MainLayout>
                    {wrapWithErrorBoundary(
                      wrapWithSuspense(<LazyPremiumPage />),
                      "premium-page"
                    )}
                  </MainLayout>
                } />
                <Route path="/view-offer/:token" element={
                  <MainLayout>
                    {wrapWithErrorBoundary(<ViewOfferPage />, "view-offer")}
                  </MainLayout>
                } />
                <Route path="/share/:token" element={
                  <MainLayout>
                    {wrapWithErrorBoundary(<SharedValuationPage />, "share-valuation")}
                  </MainLayout>
                } />
                <Route path="/payment/success" element={
                  <MainLayout>
                    {wrapWithErrorBoundary(
                      wrapWithSuspense(<LazyPaymentSuccessPage />),
                      "payment-success"
                    )}
                  </MainLayout>
                } />
                <Route path="/payment/cancelled" element={
                  <MainLayout>
                    {wrapWithErrorBoundary(
                      wrapWithSuspense(<LazyPaymentCancelledPage />),
                      "payment-cancelled"
                    )}
                  </MainLayout>
                } />
                <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
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

// In development environment, perform route validation
if (process.env.NODE_ENV === 'development') {
  import('./utils/route-validation-system').then(({ RouteIntegritySystem }) => {
    RouteIntegritySystem.initialize(appRoutes);
  }).catch(console.error);
}

export default App;
