
import React from 'react';
import { Navigate } from 'react-router-dom';

// Core pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import DealerDashboard from './pages/DealerDashboard';
import OffersPage from './pages/OffersPage';
import ViewOfferPage from './pages/view-offer/ViewOfferPage';
import PremiumPage from './pages/PremiumPage';
import ResultsPage from './pages/ResultsPage'; // Use the real ResultsPage
import MyValuationsPage from './pages/MyValuationsPage';
import ProfilePage from './pages/ProfilePage';
import AuditPage from './pages/admin/AuditPage';
import ValuationFollowUpPage from './pages/ValuationFollowUpPage';
import PlateValuationPage from './pages/valuation/plate/PlateValuationPage';

// Auth pages
import AuthPage from './pages/AuthPage';
import DealerSignup from './pages/DealerSignup';

// Auth components
import { AuthProvider } from '@/hooks/useAuth';
import { DealerGuard } from '@/guards/DealerGuard';

// Layout components
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import DealerLayout from '@/layouts/DealerLayout';

const routes = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: (
          <AuthenticatedLayout>
            <Dashboard />
          </AuthenticatedLayout>
        ),
      },
      {
        path: "dealer-dashboard",
        element: (
          <DealerGuard>
            <DealerLayout>
              <DealerDashboard />
            </DealerLayout>
          </DealerGuard>
        ),
      },
      {
        path: "offers",
        element: (
          <AuthenticatedLayout>
            <OffersPage />
          </AuthenticatedLayout>
        ),
      },
      {
        path: "view-offer/:token",
        element: <ViewOfferPage />,
      },
      {
        path: "premium",
        element: <PremiumPage />,
      },
      {
        path: "valuation-result/:id",
        element: <ResultsPage />, // Fixed: Use ResultsPage instead of ValuationResultPage
      },
      {
        path: "results/:id",
        element: <ResultsPage />, // Fixed: Use ResultsPage instead of ValuationResultPage
      },
      {
        path: "valuation/followup",
        element: <ValuationFollowUpPage />,
      },
      {
        path: "valuation/plate",
        element: <PlateValuationPage />,
      },
      {
        path: "saved-valuations",
        element: (
          <AuthenticatedLayout>
            <MyValuationsPage />
          </AuthenticatedLayout>
        ),
      },
      {
        path: "profile",
        element: (
          <AuthenticatedLayout>
            <ProfilePage />
          </AuthenticatedLayout>
        ),
      },
      {
        path: "admin/audit",
        element: (
          <AuthenticatedLayout>
            <AuditPage />
          </AuthenticatedLayout>
        ),
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "login-user",
        element: <AuthPage />,
      },
      {
        path: "login-dealer",
        element: <AuthPage />,
      },
      {
        path: "dealer-signup",
        element: <DealerSignup />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

export default routes;
