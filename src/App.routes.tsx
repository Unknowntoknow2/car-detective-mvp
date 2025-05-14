
import React from 'react';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import DealerLayout from '@/layouts/DealerLayout';
import DealerGuard from '@/guards/DealerGuard';
import AuthGuard from '@/guards/AuthGuard';
import GuestGuard from '@/guards/GuestGuard';

// Page imports
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AccessDeniedPage from '@/pages/AccessDeniedPage';

// Auth page imports
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';

// Dashboard page imports
import DashboardPage from '@/pages/DashboardPage';

// Dealer page imports
import DealerDashboard from '@/pages/DealerDashboard';
import DealerProfileSettings from '@/pages/DealerProfileSettings';
import DealerSubscriptionSettings from '@/pages/DealerSubscriptionPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route 
      element={<Layout />}
      errorElement={<div>Error Page</div>}
    >
      {/* Main site routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        } />
        <Route path="/register" element={
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        } />
        <Route path="/forgot-password" element={
          <GuestGuard>
            <ForgotPasswordPage />
          </GuestGuard>
        } />
        <Route path="/reset-password" element={
          <GuestGuard>
            <ResetPasswordPage />
          </GuestGuard>
        } />
      </Route>
      
      {/* Authenticated routes */}
      <Route element={<DashboardLayout />}>
        <Route 
          path="/dashboard" 
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          } 
        />
      </Route>
      
      {/* Dealer routes */}
      <Route element={<DealerLayout />}>
        <Route 
          path="/dealer-dashboard" 
          element={
            <DealerGuard>
              <DealerDashboard />
            </DealerGuard>
          } 
        />
        
        <Route 
          path="/dealer-profile-settings" 
          element={
            <DealerGuard>
              <DealerProfileSettings />
            </DealerGuard>
          } 
        />
        
        <Route 
          path="/dealer-subscription-settings" 
          element={
            <DealerGuard>
              <DealerSubscriptionSettings />
            </DealerGuard>
          } 
        />
      </Route>
    </Route>
  )
);

export default router;
