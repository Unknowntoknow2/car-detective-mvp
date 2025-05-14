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
import PricingPage from '@/pages/PricingPage';
import BlogPage from '@/pages/BlogPage';
import BlogArticlePage from '@/pages/BlogArticlePage';
import HelpCenterPage from '@/pages/HelpCenterPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AccessDeniedPage from '@/pages/AccessDeniedPage';

// Auth page imports
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import LogoutPage from '@/pages/LogoutPage';

// Dashboard page imports
import DashboardPage from '@/pages/DashboardPage';
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import SubscriptionSettingsPage from '@/pages/SubscriptionSettingsPage';

// Dealer page imports
import DealerDashboard from '@/pages/DealerDashboard';
import DealerProfileSettings from '@/pages/DealerProfileSettings';
import SubscriptionSettingsPage from '@/pages/SubscriptionSettingsPage';

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
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:articleId" element={<BlogArticlePage />} />
      <Route path="/help-center" element={<HelpCenterPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      
      {/* Auth routes */}
      <Route element={<GuestGuard><AuthLayout /></GuestGuard>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Route>
      
      {/* Authenticated routes */}
      <Route element={<AuthGuard />}>
        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          } 
        />
        
        <Route 
          path="/profile-settings" 
          element={
            <DashboardLayout>
              <ProfileSettingsPage />
            </DashboardLayout>
          } 
        />
        
        <Route 
          path="/subscription-settings" 
          element={
            <DashboardLayout>
              <SubscriptionSettingsPage />
            </DashboardLayout>
          } 
        />
      </Route>
      
      {/* Dealer routes */}
      <Route 
        element={
          <DealerGuard>
            <DealerLayout />
          </DealerGuard>
        }
      >
        <Route 
          path="/dealer-dashboard" 
          element={<DealerDashboard />} 
        />
        
        <Route 
          path="/dealer-profile-settings" 
          element={<DealerProfileSettings />} 
        />
        
        <Route 
          path="/dealer-subscription-settings" 
          element={<SubscriptionSettingsPage />} 
        />
      </Route>
    </Route>
  )
);

export default router;
