import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import DealerLayout from '@/layouts/DealerLayout';
import AuthGuard from '@/guards/AuthGuard';
import GuestGuard from '@/guards/GuestGuard';
import RoleGuard from '@/guards/RoleGuard';
import DealerGuard from '@/guards/DealerGuard';
import VinLookupPage from '@/pages/VinLookupPage';
import LookupPage from '@/pages/LookupPage';
import { AdminAnalyticsDashboard } from '@/components/admin/dashboard/AdminAnalyticsDashboard';
import SettingsPage from '@/pages/SettingsPage';
import ViewOfferPage from '@/pages/view-offer/[token]';
import SharedValuationPage from '@/pages/share/[token]';
import DealerManagement from '@/pages/admin/DealerManagement';
import DealerDashboard from '@/pages/DealerDashboard';
import PremiumDealerManagementPage from '@/pages/admin/PremiumDealerManagement';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import PaymentCancelledPage from '@/pages/PaymentCancelledPage';
import DealerInsightsPage from '@/pages/DealerInsightsPage';
import { EnhancedErrorBoundary } from '@/components/common/EnhancedErrorBoundary';
import PremiumPage from '@/pages/PremiumPage';
import AccessDeniedPage from '@/pages/AccessDeniedPage';

// Auth pages
import LoginUserPage from '@/pages/auth/LoginUserPage';
import LoginDealerPage from '@/pages/auth/LoginDealerPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DealerSignupPage from '@/pages/auth/DealerSignupPage';
import AuthLandingPage from '@/pages/auth/AuthLandingPage';

// Lazy-loaded components
const LazyDealerInsightsPage = lazy(() => import('@/pages/DealerInsightsPage'));

// Page loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

// Since we now use Router in App.tsx, we'll create the router configuration differently
// This file is useful if you want to use Data Routers with createBrowserRouter instead
const router = createBrowserRouter([
  // Auth routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'auth',
        element: (
          <GuestGuard>
            <AuthLandingPage />
          </GuestGuard>
        ),
      },
      {
        path: 'login-user',
        element: (
          <GuestGuard>
            <LoginUserPage />
          </GuestGuard>
        ),
      },
      {
        path: 'login-dealer',
        element: (
          <GuestGuard>
            <LoginDealerPage />
          </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        ),
      },
      {
        path: 'dealer-signup',
        element: (
          <GuestGuard>
            <DealerSignupPage />
          </GuestGuard>
        ),
      },
      {
        path: '',
        element: <VinLookupPage />,
      },
      {
        path: 'lookup',
        element: <LookupPage />,
      },
      {
        path: 'lookup/:tab',
        element: <LookupPage />,
      },
      {
        path: 'premium',
        element: (
          <EnhancedErrorBoundary context="premium">
            <PremiumPage />
          </EnhancedErrorBoundary>
        ),
      },
    ],
  },
  // Dashboard routes - for regular users
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <AdminAnalyticsDashboard />
          </AuthGuard>
        ),
      },
      {
        path: 'settings',
        element: (
          <AuthGuard>
            <SettingsPage />
          </AuthGuard>
        ),
      },
    ],
  },
  // Dealer routes
  {
    path: '/',
    element: <DealerLayout />,
    children: [
      {
        path: 'dealer-dashboard',
        element: (
          <DealerGuard>
            <EnhancedErrorBoundary context="dealer-dashboard">
              <DealerDashboard />
            </EnhancedErrorBoundary>
          </DealerGuard>
        ),
      },
      {
        path: 'dealer-insights',
        element: (
          <DealerGuard>
            <EnhancedErrorBoundary context="dealer-insights">
              <Suspense fallback={<PageLoader />}>
                <LazyDealerInsightsPage />
              </Suspense>
            </EnhancedErrorBoundary>
          </DealerGuard>
        ),
      },
    ],
  },
  // Admin routes
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'admin/dealers',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <DealerManagement />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/premium-dealers',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <PremiumDealerManagementPage />
          </RoleGuard>
        ),
      },
    ],
  },
  // Public routes
  {
    path: '/view-offer/:token',
    element: (
      <EnhancedErrorBoundary context="view-offer">
        <ViewOfferPage />
      </EnhancedErrorBoundary>
    ),
  },
  {
    path: '/share/:token',
    element: (
      <EnhancedErrorBoundary context="shared-valuation">
        <SharedValuationPage />
      </EnhancedErrorBoundary>
    ),
  },
  {
    path: '/payment/success',
    element: (
      <EnhancedErrorBoundary context="payment-success">
        <PaymentSuccessPage />
      </EnhancedErrorBoundary>
    ),
  },
  {
    path: '/payment/cancelled',
    element: (
      <EnhancedErrorBoundary context="payment-cancelled">
        <PaymentCancelledPage />
      </EnhancedErrorBoundary>
    ),
  },
  // Access Denied route
  {
    path: '/access-denied',
    element: <AccessDeniedPage />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
