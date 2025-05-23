
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { EnhancedHomePage } from './components/home/EnhancedHomePage';
import AboutPage from './pages/AboutPage';
import VinLookupPage from './pages/VinLookupPage';
import NotFound from './pages/NotFound';
import ValuationPage from './pages/ValuationPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import ValuationResultPage from '@/pages/ValuationResultPage';
import ResultPage from './pages/ResultPage';
import DealerDashboardPage from './pages/dealer/DealerDashboardPage';
import DealerVehicleDetailsPage from './pages/dealer/DealerVehicleDetailsPage';
import DealerLayoutPage from './pages/dealer/DealerLayoutPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
import ServiceHistoryPage from './pages/ServiceHistoryPage';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ChooseRolePage from './pages/auth/ChooseRolePage';
import IndividualAuthPage from './pages/auth/IndividualAuthPage';
import DealerAuthPage from './pages/auth/DealerAuthPage';
import UnifiedAuthPage from './pages/auth/UnifiedAuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

// Export routes configuration that can be used with useRoutes() hook
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <EnhancedHomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'vin-lookup',
        element: <VinLookupPage />
      },
      // New auth flow routes
      {
        path: 'auth',
        element: <UnifiedAuthPage />
      },
      {
        path: 'auth/callback',
        element: <AuthCallbackPage />
      },
      {
        path: 'auth/choose',
        element: <ChooseRolePage />
      },
      {
        path: 'auth/individual',
        element: <IndividualAuthPage />
      },
      {
        path: 'auth/dealer',
        element: <DealerAuthPage />
      },
      // Legacy auth routes - redirect to unified auth
      {
        path: 'login',
        element: <UnifiedAuthPage />
      },
      {
        path: 'register',
        element: <UnifiedAuthPage />
      },
      {
        path: 'sign-up',
        element: <UnifiedAuthPage />
      },
      {
        path: 'signup',
        element: <UnifiedAuthPage />
      },
      {
        path: 'signup/individual',
        element: <IndividualAuthPage />
      },
      {
        path: 'signup/dealer',
        element: <DealerAuthPage />
      },
      {
        path: 'sign-in',
        element: <UnifiedAuthPage />
      },
      {
        path: 'signin',
        element: <UnifiedAuthPage />
      },
      {
        path: 'signin/individual',
        element: <IndividualAuthPage />
      },
      {
        path: 'signin/dealer',
        element: <DealerAuthPage />
      },
      {
        path: 'dealer-signup',
        element: <UnifiedAuthPage />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'valuation',
        element: <ValuationPage />
      },
      {
        path: 'premium-valuation',
        element: <PremiumValuationPage />
      },
      {
        path: 'valuation/result/:id',
        element: <ValuationResultPage />
      },
      {
        path: 'result',
        element: <ResultPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'account',
        element: <AccountPage />
      },
      {
        path: 'service-history',
        element: <ServiceHistoryPage />
      },
      {
        path: 'dealer',
        element: <DealerLayoutPage />,
        children: [
          {
            index: true,
            element: <DealerDashboardPage />
          },
          {
            path: 'vehicle/:id',
            element: <DealerVehicleDetailsPage />
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: '/valuation/:id',
    element: <ValuationResultPage />
  }
];

export default routes;
