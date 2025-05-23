
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { EnhancedHomePage } from './components/home/EnhancedHomePage';
import AboutPage from './pages/AboutPage';
import VinLookupPage from './pages/VinLookupPage';
import NotFound from './pages/NotFound';
import ValuationPage from './pages/ValuationPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import ValuationResultPage from './pages/ValuationResultPage';
import ResultPage from './pages/ResultPage';
import DealerDashboardPage from './pages/dealer/DealerDashboardPage';
import DealerVehicleDetailsPage from './pages/dealer/DealerVehicleDetailsPage';
import DealerLayoutPage from './pages/dealer/DealerLayoutPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
import ServiceHistoryPage from './pages/ServiceHistoryPage';
import Layout from './components/layout/Layout';
import UnifiedAuthPage from './pages/auth/UnifiedAuthPage';
import DashboardPage from './pages/DashboardPage';
import DashboardRouter from './components/dashboard/DashboardRouter';
import ResultsPage from './pages/ResultsPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import IndividualAuthPage from './pages/auth/IndividualAuthPage';
import DealerAuthPage from './pages/auth/DealerAuthPage';

// Export routes configuration
const routes: RouteObject[] = [
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
      
      // Unified auth routes
      {
        path: 'auth',
        element: <UnifiedAuthPage />
      },
      {
        path: 'auth/callback',
        element: <AuthCallbackPage />
      },
      {
        path: 'auth/individual',
        element: <IndividualAuthPage />
      },
      {
        path: 'auth/dealer',
        element: <DealerAuthPage />
      },
      
      // Redirect legacy auth routes to the new unified auth page
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
        path: 'sign-in',
        element: <UnifiedAuthPage />
      },
      {
        path: 'signin',
        element: <UnifiedAuthPage />
      },
      {
        path: 'dealer-signup',
        element: <UnifiedAuthPage />
      },
      
      {
        path: 'dashboard',
        element: <DashboardRouter />
      },
      {
        path: 'dashboard/individual',
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
            path: 'dashboard',
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
  }
];

export default routes;
