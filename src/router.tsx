
import React from 'react';
import { RouteObject } from 'react-router-dom';
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
import UnifiedAuthPage from './pages/auth/UnifiedAuthPage';
import DashboardPage from './pages/DashboardPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import PlatformDiagnosticsPage from './pages/PlatformDiagnosticsPage';
import AuditPage from './pages/AuditPage';

// Export routes configuration
const routes: RouteObject[] = [
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
  
  // Main auth route - unified authentication
  {
    path: 'auth',
    element: <UnifiedAuthPage />
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
  
  // Admin routes
  {
    path: 'audit',
    element: <AuditPage />
  },
  
  // Dashboard routes
  {
    path: 'dashboard',
    element: <DashboardPage />
  },
  
  // Enhanced Valuation routes with proper VIN handling
  {
    path: 'valuation',
    element: <ValuationPage />
  },
  {
    path: 'valuation/:vin',
    element: <ValuationPage />
  },
  {
    path: 'valuation-followup',
    element: <ValuationFollowupPage />
  },
  {
    path: 'premium',
    element: <PremiumPage />
  },
  {
    path: 'valuation/result/:id',
    element: <ValuationResultPage />
  },
  {
    path: 'valuation/vin/:vin/followup',
    element: <VinLookupPage />
  },
  {
    path: 'valuation/:id',
    element: <ValuationResultPage />
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
];

export default routes;
