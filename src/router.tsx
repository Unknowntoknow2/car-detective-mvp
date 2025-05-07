
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';

// Lazy load pages
import ForgotPasswordPage from './modules/auth/ForgotPasswordPage';
import ConfirmationPage, { ConfirmationPageProps } from './modules/auth/ConfirmationPage';
import VpicDecoderPage from './pages/VpicDecoderPage';
import NicbVinCheckPage from './pages/NicbVinCheckPage';
import LookupPage from './pages/LookupPage';

// Admin components
import { AdminAnalyticsDashboard } from './components/admin/dashboard/AdminAnalyticsDashboard';

export const Router = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route element={<GuestGuard />}>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/signup-success" element={
            <ConfirmationPage 
              title="Registration Successful" 
              message="Your account has been created. You can now log in." 
              buttonText="Go to Login" 
              buttonHref="/login" 
            />
          } />
        </Route>
      </Route>

      {/* Protected dashboard routes */}
      <Route element={<DashboardLayout />}>
        <Route element={<AuthGuard />}>
          <Route path="/admin/analytics" element={<AdminAnalyticsDashboard />} />
        </Route>
      </Route>

      {/* Public routes */}
      <Route path="/vpic-decoder" element={<VpicDecoderPage />} />
      <Route path="/nicb-check" element={<NicbVinCheckPage />} />
      <Route path="/lookup" element={<LookupPage />} />
      <Route path="/lookup/vin" element={<LookupPage />} />

      {/* Redirect root to lookup */}
      <Route path="/" element={<Navigate to="/lookup" replace />} />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
