
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ValuationProvider } from '@/contexts/ValuationContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import VpicDecoderPage from '@/pages/VpicDecoderPage';
import ValuationPage from '@/pages/ValuationPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import SettingsPage from '@/pages/SettingsPage';
import AccessDeniedPage from '@/pages/AccessDeniedPage';

// Components for route protection
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AuthRoute from '@/components/auth/AuthRoute';
import DealerGuard from '@/guards/DealerGuard';

// Lazy loaded components
const PremiumValuationPage = React.lazy(() => import('@/pages/PremiumValuationPage'));
const MyValuationsPage = React.lazy(() => import('@/pages/MyValuationsPage'));
const ValuationDetailsPage = React.lazy(() => import('@/pages/ValuationDetailPage')); // Note: Using existing ValuationDetailPage
const DealerDashboardPage = React.lazy(() => import('@/pages/DealerDashboard')); // Note: Using existing DealerDashboard

function App() {
  return (
    <AuthProvider>
      <ValuationProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Index />} />
            <Route path="valuation" element={<ValuationPage />} />
            <Route path="valuation/:id" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <ValuationDetailsPage />
              </React.Suspense>
            } />
            <Route path="decoder" element={<VpicDecoderPage />} />
            
            {/* Auth routes - redirect to dashboard if logged in */}
            <Route element={<AuthRoute />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
            </Route>
            
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="premium-valuation" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <PremiumValuationPage />
                </React.Suspense>
              } />
              <Route path="my-valuations" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <MyValuationsPage />
                </React.Suspense>
              } />
              
              {/* Dealer-only routes */}
              <Route element={<DealerGuard />}>
                <Route path="dealer-dashboard" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <DealerDashboardPage />
                  </React.Suspense>
                } />
              </Route>
            </Route>
            
            {/* Error pages */}
            <Route path="access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Route>
        </Routes>
        <Toaster />
      </ValuationProvider>
    </AuthProvider>
  );
}

export default App;
