
import React, { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
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
import SignupPage from '@/pages/SignupPage';

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

// Export routes configuration that can be used with useRoutes() hook
const routes: RouteObject[] = [
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
        path: 'signin/individual',
        element: (
          <GuestGuard>
            <LoginUserPage />
          </GuestGuard>
        ),
      },
      {
        path: 'signin/dealer',
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
        path: 'sign-up',
        element: (
          <GuestGuard>
            <SignupPage />
          </GuestGuard>
        ),
      },
      {
        path: 'signup/individual',
        element: (
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        ),
      },
      {
        path: 'signup/dealer',
        element: (
          <GuestGuard>
            <DealerSignupPage />
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
  // Dashboard routes
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
];

export default routes;
