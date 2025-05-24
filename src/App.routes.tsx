
import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { EnhancedHomePage } from './components/home/EnhancedHomePage';
import AboutPage from './pages/AboutPage';
import VinLookupPage from './pages/VinLookupPage';
import NotFound from './pages/NotFound';
import ValuationPage from './pages/ValuationPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import ValuationResultPage from '@/pages/ValuationResultPage';
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
      
      // Core auth routes
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
        element: <Navigate to="/auth" replace />
      },
      {
        path: 'register',
        element: <Navigate to="/auth" replace />
      },
      {
        path: 'sign-up',
        element: <Navigate to="/auth" replace />
      },
      {
        path: 'signup',
        element: <Navigate to="/auth" replace />
      },
      {
        path: 'sign-in',
        element: <Navigate to="/auth" replace />
      },
      {
        path: 'signin',
        element: <Navigate to="/auth" replace />
      },
      {
        path: 'signup/individual',
        element: <Navigate to="/auth/individual" replace />
      },
      {
        path: 'signup/dealer',
        element: <Navigate to="/auth/dealer" replace />
      },
      {
        path: 'signin/individual',
        element: <Navigate to="/auth/individual" replace />
      },
      {
        path: 'signin/dealer',
        element: <Navigate to="/auth/dealer" replace />
      },
      {
        path: 'dealer-signup',
        element: <Navigate to="/auth/dealer" replace />
      },
      
      // Dashboard routes
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'dashboard/individual',
        element: <Navigate to="/dashboard" replace />
      },
      
      // Valuation routes
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
        element: <Navigate to="/valuation" replace />
      },
      
      // Profile and account routes
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
      
      // Dealer routes
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
      
      // Catch-all 404 route
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  // Fix redirect route to use proper pattern
  {
    path: 'valuation/:id',
    element: <Navigate to="/valuation/result/:id" replace />
  }
];

export default routes;
