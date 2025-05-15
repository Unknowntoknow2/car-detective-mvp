
import React from 'react';
import { RouteObject } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import VinLookupPage from './pages/VinLookupPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ValuationPage from './pages/ValuationPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import ValuationResultPage from './pages/ValuationResultPage';
import DealerDashboardPage from './pages/dealer/DealerDashboardPage';
import DealerVehicleDetailsPage from './pages/dealer/DealerVehicleDetailsPage';
import DealerLayoutPage from './pages/dealer/DealerLayoutPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/account/AccountPage';
import ServiceHistoryPage from './pages/ServiceHistoryPage';
import Layout from './components/layout/Layout';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout>
      <HomePage />
    </Layout>,
  },
  {
    path: '/about',
    element: <Layout>
      <AboutPage />
    </Layout>,
  },
  {
    path: '/vin-lookup',
    element: <Layout>
      <VinLookupPage />
    </Layout>,
  },
  {
    path: '/login',
    element: <Layout>
      <LoginPage />
    </Layout>,
  },
  {
    path: '/register',
    element: <Layout>
      <RegisterPage />
    </Layout>,
  },
  {
    path: '/valuation',
    element: <Layout>
      <ValuationPage />
    </Layout>,
  },
  {
    path: '/premium-valuation',
    element: <Layout>
      <PremiumValuationPage />
    </Layout>,
  },
  {
    path: '/valuation/result/:id',
    element: <Layout>
      <ValuationResultPage />
    </Layout>,
  },
  {
    path: '/profile',
    element: <Layout>
      <ProfilePage />
    </Layout>,
  },
  {
    path: '/account',
    element: <Layout>
      <AccountPage />
    </Layout>,
  },
  {
    path: '/service-history',
    element: <Layout>
      <ServiceHistoryPage />
    </Layout>,
  },
  {
    path: '/dealer',
    element: <Layout>
      <DealerLayoutPage />
    </Layout>,
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
    element: <Layout>
      <NotFoundPage />
    </Layout>,
  },
];

export default routes;
