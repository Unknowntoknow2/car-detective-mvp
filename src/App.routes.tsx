import React from 'react';
import { RouteObject } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import VinLookupPage from './pages/VinLookupPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
import SignInPage from './pages/auth/SignInPage';
import AuthPage from './pages/AuthPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'vin-lookup',
        element: <VinLookupPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'sign-in',
        element: <SignInPage />
      },
      {
        path: 'auth',
        element: <AuthPage />
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
