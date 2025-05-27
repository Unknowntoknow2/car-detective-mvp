
import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { EnhancedHomePage } from './components/home/EnhancedHomePage';
import AboutPage from './pages/AboutPage';
import VinLookupPage from './pages/VinLookupPage';
import NotFound from './pages/NotFound';
import ValuationPage from './pages/ValuationPage';
import PremiumPage from './pages/PremiumPage';
import ValuationResultPage from './pages/ValuationResultPage';
import ValuationFollowupPage from './pages/ValuationFollowupPage';
import DealerDashboardPage from './pages/dealer/DealerDashboardPage';
import DealerVehicleDetailsPage from './pages/dealer/DealerVehicleDetailsPage';
import DealerLayoutPage from './pages/dealer/DealerLayoutPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
import ServiceHistoryPage from './pages/ServiceHistoryPage';
import Layout from './components/layout/Layout';
import UnifiedAuthPage from './pages/auth/UnifiedAuthPage';
import DashboardPage from './pages/DashboardPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import IndividualAuthPage from './pages/auth/IndividualAuthPage';
import DealerAuthPage from './pages/auth/DealerAuthPage';
import PlatformDiagnosticsPage from './pages/PlatformDiagnosticsPage';

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
      
      // Core auth routes - keep only the canonical ones
      {
        path: 'auth',
        element: <UnifiedAuthPage />
      },
      {
        path: 'auth/individual',
        element: <IndividualAuthPage />
      },
      {
        path: 'auth/dealer',
        element: <DealerAuthPage />
      },
      {
        path: 'auth/callback',
        element: <AuthCallbackPage />
      },
      
      // Platform diagnostics page
      {
        path: 'platform-diagnostics',
        element: <PlatformDiagnosticsPage />
      },
      
      // Redirect legacy auth routes to the canonical paths
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
        path: 'dealer-signup',
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
        path: 'signup/individual',
        element: <Navigate to="/auth/individual" replace />
      },
      {
        path: 'signup/dealer',
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
      
      // CONSOLIDATED Valuation routes - this is the main fix
      {
        path: 'valuation',
        element: <ValuationPage />
      },
      {
        path: 'valuation/:vin',
        element: <ValuationPage />
      },
      {
        path: 'premium',
        element: <PremiumPage />
      },
      
      // Redirect old routes to new consolidated routes
      {
        path: 'valuation-followup',
        element: <Navigate to="/vin-lookup" replace />
      },
      {
        path: 'valuation/result/:id',
        element: <Navigate to="/valuation" replace />
      },
      {
        path: 'valuation/vin/:vin/followup',
        element: <Navigate to="/vin-lookup" replace />
      },
      {
        path: 'valuation/:id',
        element: <ValuationPage />
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
            path: 'dashboard',
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
  }
];

export default routes;
