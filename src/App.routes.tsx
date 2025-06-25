
import React from 'react';
import { Navigate } from 'react-router-dom';

// Core pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DealerDashboard from './pages/DealerDashboard';
import OffersPage from './pages/OffersPage';
import ViewOfferPage from './pages/view-offer/ViewOfferPage';
import PremiumPage from './pages/PremiumPage';
import ValuationResultPage from './pages/ValuationResultPage';
import SavedValuationsPage from './pages/SavedValuationsPage';
import ProfilePage from './pages/ProfilePage';
import ReferralsPage from './pages/ReferralsPage';
import AuditPage from './pages/admin/AuditPage';

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
        element: <Home />,
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
        element: <ValuationResultPage />,
      },
      {
        path: "saved-valuations",
        element: (
          <AuthenticatedLayout>
            <SavedValuationsPage />
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
        path: "referrals",
        element: (
          <AuthenticatedLayout>
            <ReferralsPage />
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
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

export default routes;
