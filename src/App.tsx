<<<<<<< HEAD
// ✅ File: src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/layout/AppLayout';

import HomePage from '@/pages/HomePage';
import ValuationPage from '@/pages/ValuationPage';
import ValuationResultPage from '@/pages/ValuationResultPage';
import ValuationDetailPage from '@/pages/ValuationDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PremiumPage from '@/pages/Premium';
import PremiumSuccessPage from '@/pages/PremiumSuccessPage';
=======
// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage'; // ✅ Automatically uses EnhancedHomePage
import { Toaster } from 'sonner';
>>>>>>> origin/main

// Auth pages - with case-sensitive imports
import SignUpPage from '@/pages/auth/SignUpPage';
import SignInPage from '@/pages/auth/SignInPage';
import AccessDeniedPage from '@/pages/auth/AccessDeniedPage';
import Premium from '@/pages/Premium';

import Dashboard from '@/pages/dashboard/Dashboard';
import DealerDashboardRoutes from '@/pages/dealer/DealerDashboardRoutes';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { AuthProvider } from '@/contexts/AuthContext';

const App = () => {
  console.log('🔄 App component rendering...');
  
  return (
<<<<<<< HEAD
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/valuation" element={<ValuationPage />} />
        <Route path="/result" element={<ValuationResultPage />} />
        <Route path="/valuation/detail/:id" element={<ValuationDetailPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/premium/success" element={<PremiumSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </AppLayout>
=======
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <div className="app-root">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="/premium" element={<Premium />} />

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
        </Routes>
      </div>
    </AuthProvider>
>>>>>>> origin/main
  );
};

export default App;
