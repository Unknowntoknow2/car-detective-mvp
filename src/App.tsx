
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
import NotFound from '@/pages/NotFound';
import Premium from '@/pages/Premium';

// Components for route protection
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AuthRoute from '@/components/auth/AuthRoute';
import DealerGuard from '@/guards/DealerGuard';

// Lazy loaded components
const PremiumValuationPage = React.lazy(() => import('@/pages/PremiumValuationPage'));
const MyValuationsPage = React.lazy(() => import('@/pages/MyValuationsPage'));
const ValuationDetailsPage = React.lazy(() => import('@/pages/ValuationDetailPage')); 
const DealerDashboardPage = React.lazy(() => import('@/pages/DealerDashboard'));

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
            <Route path="premium" element={<Premium />} />
            
            {/* Auth routes - redirect to dashboard if logged in */}
            <Route path="login" element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            } />
            <Route path="register" element={
              <AuthRoute>
                <RegisterPage />
              </AuthRoute>
            } />
            <Route path="forgot-password" element={
              <AuthRoute>
                <ForgotPasswordPage />
              </AuthRoute>
            } />
            <Route path="reset-password" element={
              <AuthRoute>
                <ResetPasswordPage />
              </AuthRoute>
            } />
            
            {/* Protected routes - require authentication */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="premium-valuation" element={
              <ProtectedRoute>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <PremiumValuationPage />
                </React.Suspense>
              </ProtectedRoute>
            } />
            <Route path="my-valuations" element={
              <ProtectedRoute>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <MyValuationsPage />
                </React.Suspense>
              </ProtectedRoute>
            } />
              
            {/* Dealer-only routes */}
            <Route path="dealer-dashboard" element={
              <DealerGuard>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <DealerDashboardPage />
                </React.Suspense>
              </DealerGuard>
            } />
            
            {/* Error pages */}
            <Route path="access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </ValuationProvider>
    </AuthProvider>
  );
}

export default App;
