
import React from 'react';
import { Navigate } from 'react-router-dom';

// Core pages
import ProfessionalHomePage from './pages/ProfessionalHomePage';
import Dashboard from './pages/Dashboard';
import DealerDashboard from './pages/DealerDashboard';
import OffersPage from './pages/OffersPage';
import ViewOfferPage from './pages/view-offer/ViewOfferPage';
import PremiumPage from './pages/PremiumPage';
import ResultsPage from './pages/ResultsPage'; // Use the real ResultsPage
import MyValuationsPage from './pages/MyValuationsPage';
import ProfilePage from './pages/ProfilePage';
import AuditPage from './pages/admin/AuditPage';
import ValuationInsightsPage from './pages/admin/ValuationInsightsPage';
import ValuationFollowUpPage from './pages/ValuationFollowUpPage';
import PlateValuationPage from './pages/valuation/plate/PlateValuationPage';
import ModalShowcase from './pages/ModalShowcase';

// Auth pages
import AuthPage from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';
import DealerSignup from './pages/DealerSignup';
import ResetPasswordPage from './pages/ResetPasswordPage';

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
        element: <ProfessionalHomePage />,
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
        path: "modals",
        element: <ModalShowcase />,
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
        path: "admin/valuation-insights",
        element: (
          <AuthenticatedLayout>
            <ValuationInsightsPage />
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
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "auth/callback",
        element: <AuthCallback />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

export default routes;
