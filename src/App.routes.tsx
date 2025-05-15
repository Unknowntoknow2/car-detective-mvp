
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
    element: <SiteLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <HomePage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/about',
    element: <SiteLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <AboutPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/contact',
    element: <SiteLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <ContactPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <LoginPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/forgot-password',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/reset-password',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <ResetPasswordPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <DashboardPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/profile',
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <ProfilePage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/settings',
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <SettingsPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/admin-dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/dealer-dashboard',
    element: <DealerLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <DealerDashboardPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/dealer-inventory',
    element: <DealerLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <DealerInventoryPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/dealer-subscription',
    element: <DealerLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <DealerSubscriptionPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/vehicle/:id',
    element: <SiteLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <VehicleDetailsPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/valuation',
    element: <SiteLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <UnifiedValuationPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/terms-of-service',
    element: <SiteLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <TermsOfServicePage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/privacy-policy',
    element: <SiteLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <PrivacyPolicyPage />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: '/dealer-subscription-plans',
    element: <DealerSubscriptionPlansPage />,
  },
  {
    path: '*',
    element: <SiteLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loading />}>
            <NotFoundPage />
          </Suspense>
        ),
      }
    ]
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
