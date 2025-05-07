
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthGuard } from './guards/AuthGuard';
import { GuestGuard } from './guards/GuestGuard';

// Pages
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LookupPage from './pages/LookupPage';
import SignInPage from './modules/auth/SignInPage';
import SignUpPage from './modules/auth/SignUpPage';
import ForgotPasswordPage from './modules/auth/ForgotPasswordPage';
import ResetPasswordPage from './modules/auth/ResetPasswordPage';
import MagicLinkPage from './modules/auth/MagicLinkPage';
import ConfirmationPage from './modules/auth/ConfirmationPage';
import AdminAnalyticsDashboard from './components/admin/dashboard/AdminAnalyticsDashboard';
import DesignSystem from './pages/DesignSystem';
import PremiumValuationPage from './pages/PremiumValuationPage';
import MyValuationsPage from './pages/MyValuationsPage';
import ProfilePage from './pages/ProfilePage';
import SharePage from './pages/share/[token]';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth routes */}
        <Route element={<GuestGuard />}>
          <Route element={<AuthLayout title="Sign In" />}>
            <Route path="/login" element={<SignInPage />} />
          </Route>
          <Route element={<AuthLayout title="Sign Up" />}>
            <Route path="/register" element={<SignUpPage />} />
          </Route>
          <Route element={<AuthLayout title="Reset Password" />}>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
          <Route element={<AuthLayout title="Reset Password" />}>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
          <Route element={<AuthLayout title="Magic Link" />}>
            <Route path="/magic-link" element={<MagicLinkPage />} />
          </Route>
          <Route 
            path="/auth/confirmation" 
            element={
              <ConfirmationPage 
                title="Email Confirmed" 
                message="Your email has been confirmed! You can now sign in."
                buttonText="Sign In"
                buttonHref="/login"
              />
            } 
          />
        </Route>
        
        {/* Protected routes */}
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/lookup/*" element={<LookupPage />} />
            <Route path="/valuations" element={<MyValuationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/premium-valuation" element={<PremiumValuationPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsDashboard />} />
          </Route>
        </Route>
        
        {/* Shared valuation page */}
        <Route path="/share/:token" element={<SharePage />} />
        
        {/* Design system (development only) */}
        <Route path="/design" element={<DesignSystem />} />
        
        {/* Not found */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
