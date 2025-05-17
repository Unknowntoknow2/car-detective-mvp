
// ✅ File: src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Toaster } from 'sonner'; // unified source

// Pages
import HomePage from '@/pages/HomePage';
import ValuationPage from '@/pages/ValuationPage';
import ValuationResultPage from '@/pages/ValuationResultPage';
import ValuationDetailPage from '@/pages/ValuationDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PremiumPage from '@/pages/Premium';
import PremiumSuccessPage from '@/pages/PremiumSuccessPage';
import ValuationFollowUpPage from '@/pages/ValuationFollowUpPage';

// Auth pages
import SignUpPage from '@/pages/auth/SignUpPage';
import SignInPage from '@/pages/auth/SignInPage';
import AccessDeniedPage from '@/pages/auth/AccessDeniedPage';
import DealerSignupPage from '@/pages/auth/DealerSignupPage';
import LoginUserPage from '@/pages/auth/LoginUserPage';
import LoginDealerPage from '@/pages/auth/LoginDealerPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Layout & Context
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { AuthProvider } from '@/contexts/AuthContext';

// Dealer/Dashboard
import Dashboard from '@/pages/dashboard/Dashboard';
import DealerDashboardRoutes from '@/pages/dealer/DealerDashboardRoutes';

const App = () => {
  console.log('🔄 App component rendering...');

  return (
    <AuthProvider>
      <AppLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/valuation" element={<ValuationPage />} />
          <Route path="/result" element={<ValuationResultPage />} />
          <Route path="/valuation/detail/:id" element={<ValuationDetailPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/premium/success" element={<PremiumSuccessPage />} />
          <Route path="/valuation-followup" element={<ValuationFollowUpPage />} />

          {/* Auth Routes */}
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login-user" element={<LoginUserPage />} />
          <Route path="/login-dealer" element={<LoginDealerPage />} />
          <Route path="/dealer-signup" element={<DealerSignupPage />} />

          {/* Authenticated Routes */}
          <Route
            path="/dashboard"
            element={
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/dealer/*"
            element={
              <AuthenticatedLayout requireRole="dealer">
                <DealerDashboardRoutes />
              </AuthenticatedLayout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster richColors position="top-center" />
      </AppLayout>
    </AuthProvider>
  );
};

export default App;
