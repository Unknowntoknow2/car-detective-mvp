
import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { EnhancedHomePage } from './components/home/EnhancedHomePage';
import AboutPage from './pages/AboutPage';
import VinLookupPage from './pages/VinLookupPage';
import NotFound from './pages/NotFound';
import ValuationPage from './pages/ValuationPage';
import PremiumPage from './pages/PremiumPage';
import DealerDashboardPage from './pages/dealer/DealerDashboardPage';
import DealerVehicleDetailsPage from './pages/dealer/DealerVehicleDetailsPage';
import DealerLayoutPage from './pages/dealer/DealerLayoutPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
import ServiceHistoryPage from './pages/ServiceHistoryPage';
import Layout from './components/layout/Layout';
import AuthPage from './pages/auth/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import PlatformDiagnosticsPage from './pages/PlatformDiagnosticsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

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
      
      // Single auth route
      {
        path: 'auth',
        element: <AuthPage />
      },
      {
        path: 'auth/callback',
        element: <AuthCallbackPage />
      },
      
      // Platform diagnostics
      {
        path: 'platform-diagnostics',
        element: <PlatformDiagnosticsPage />
      },
      
      // Redirect all legacy auth routes
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
        element: <Navigate to="/auth" replace />
      },
      
      // Protected dashboard
      {
        path: 'dashboard',
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
      },
      
      // Valuation routes
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
      
      // Protected profile routes
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
      },
      {
        path: 'account',
        element: <ProtectedRoute><AccountPage /></ProtectedRoute>
      },
      {
        path: 'service-history',
        element: <ProtectedRoute><ServiceHistoryPage /></ProtectedRoute>
      },
      
      // Protected dealer routes
      {
        path: 'dealer',
        element: <ProtectedRoute requireRole="dealer"><DealerLayoutPage /></ProtectedRoute>,
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
      
      // 404 route
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

export default routes;
