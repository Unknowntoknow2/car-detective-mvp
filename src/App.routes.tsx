import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import SiteLayout from '@/layouts/SiteLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import DealerLayout from '@/layouts/DealerLayout';
import Loading from '@/components/ui/loading';
import DealerSubscriptionPlansPage from '@/pages/dealer/DealerSubscriptionPlansPage';

// Lazy-loaded components
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const DealerDashboardPage = lazy(() => import('@/pages/dealer/DealerDashboardPage'));
const DealerInventoryPage = lazy(() => import('@/pages/dealer/DealerInventoryPage'));
const DealerSubscriptionPage = lazy(() => import('@/pages/dealer/DealerSubscriptionPage'));
const VehicleDetailsPage = lazy(() => import('@/pages/VehicleDetailsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const UnifiedValuationPage = lazy(() => import('@/pages/ValuationPage'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));

// Update the routes to include the new DealerSubscriptionPlansPage
export const routes = [
  {
    path: '/',
    element: (
      <SiteLayout>
        <Suspense fallback={<Loading />}>
          <HomePage />
        </Suspense>
      </SiteLayout>
    ),
  },
  {
    path: '/about',
    element: (
      <SiteLayout>
        <Suspense fallback={<Loading />}>
          <AboutPage />
        </Suspense>
      </SiteLayout>
    ),
  },
  {
    path: '/contact',
    element: (
      <SiteLayout>
        <Suspense fallback={<Loading />}>
          <ContactPage />
        </Suspense>
      </SiteLayout>
    ),
  },
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Suspense fallback={<Loading />}>
          <LoginPage />
        </Suspense>
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <Suspense fallback={<Loading />}>
          <RegisterPage />
        </Suspense>
      </AuthLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthLayout>
        <Suspense fallback={<Loading />}>
          <ForgotPasswordPage />
        </Suspense>
      </AuthLayout>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <AuthLayout>
        <Suspense fallback={<Loading />}>
          <ResetPasswordPage />
        </Suspense>
      </AuthLayout>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <DashboardLayout>
        <Suspense fallback={<Loading />}>
          <DashboardPage />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: '/profile',
    element: (
      <DashboardLayout>
        <Suspense fallback={<Loading />}>
          <ProfilePage />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: '/settings',
    element: (
      <DashboardLayout>
        <Suspense fallback={<Loading />}>
          <SettingsPage />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: '/admin-dashboard',
    element: (
      <DashboardLayout>
        <Suspense fallback={<Loading />}>
          <AdminDashboardPage />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: '/dealer-dashboard',
    element: (
      <DealerLayout>
        <Suspense fallback={<Loading />}>
          <DealerDashboardPage />
        </Suspense>
      </DealerLayout>
    ),
  },
  {
    path: '/dealer-inventory',
    element: (
      <DealerLayout>
        <Suspense fallback={<Loading />}>
          <DealerInventoryPage />
        </Suspense>
      </DealerLayout>
    ),
  },
  {
    path: '/dealer-subscription',
    element: (
      <DealerLayout>
        <Suspense fallback={<Loading />}>
          <DealerSubscriptionPage />
        </Suspense>
      </DealerLayout>
    ),
  },
  {
    path: '/vehicle/:id',
    element: (
      <SiteLayout>
        <Suspense fallback={<Loading />}>
          <VehicleDetailsPage />
        </Suspense>
      </SiteLayout>
    ),
  },
  {
    path: '/valuation',
    element: (
      <SiteLayout>
        <Suspense fallback={<Loading />}>
          <UnifiedValuationPage />
        </Suspense>
      </SiteLayout>
    ),
  },
  {
    path: '/terms-of-service',
    element: (
      <SiteLayout>
        <Suspense fallback={<Loading />}>
          <TermsOfServicePage />
        </Suspense>
      </SiteLayout>
    ),
  },
  {
    path: '/privacy-policy',
    element: (
      <SiteLayout>
        <Suspense fallback={<Loading />}>
          <PrivacyPolicyPage />
        </Suspense>
      </SiteLayout>
    ),
  },
  {
    path: '/dealer-subscription-plans',
    element: <DealerSubscriptionPlansPage />,
  },
  {
    path: '*',
    element: (
      <SiteLayout>
        <Suspense fallback={<Loading />}>
          <NotFoundPage />
        </Suspense>
      </SiteLayout>
    ),
  },
];

export const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/admin-dashboard',
  '/dealer-dashboard',
  '/dealer-inventory',
  '/dealer-subscription',
];

export const adminRoutes = ['/admin-dashboard'];

export const dealerRoutes = ['/dealer-dashboard', '/dealer-inventory', '/dealer-subscription'];
