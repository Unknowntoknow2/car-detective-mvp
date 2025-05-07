import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/modules/auth/AuthContext';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const SignInPage = React.lazy(() => import('./modules/auth/SignInPage'));
const SignUpPage = React.lazy(() => import('./modules/auth/SignUpPage'));
const MagicLinkPage = React.lazy(() => import('./modules/auth/MagicLinkPage'));
const ResetPasswordPage = React.lazy(() => import('./modules/auth/ResetPasswordPage'));
const ConfirmationPage = React.lazy(() => import('./modules/auth/ConfirmationPage'));
const AuthCallbackPage = React.lazy(() => import('./modules/auth/AuthCallbackPage'));
const QADashboardPage = React.lazy(() => import('./modules/qa-dashboard/page'));

function Router() {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      }>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth routes */}
          <Route path="/auth">
            <Route path="signin" element={<SignInPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="magic-link" element={<MagicLinkPage />} />
            <Route path="forgot-password" element={<ResetPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="confirmation" element={<ConfirmationPage />} />
            <Route path="callback" element={<AuthCallbackPage />} />
          </Route>
          
          {/* Protected routes */}
          <Route path="/qa" element={<QADashboardPage />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default Router;
