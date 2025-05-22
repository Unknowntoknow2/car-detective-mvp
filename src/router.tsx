
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
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DealerSignup from './pages/DealerSignup';
import ChooseRolePage from './pages/auth/ChooseRolePage';
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
      // Auth related routes
      {
        path: 'auth',
        element: <AuthPage />
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
      // Redirect legacy auth routes
      {
        path: 'login',
        element: <ChooseRolePage />
      },
      {
        path: 'register',
        element: <ChooseRolePage />
      },
      {
        path: 'sign-up',
        element: <ChooseRolePage />
      },
      {
        path: 'signup',
        element: <ChooseRolePage />
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
        element: <ChooseRolePage />
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
        element: <DealerAuthPage />
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
  }
];

export default routes;
