
import React from 'react';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import ValuationPage from '@/pages/ValuationPage';
import ValuationResultPage from '@/pages/ValuationResultPage';
import MyValuationsPage from '@/pages/MyValuationsPage';
import PremiumValuationPage from '@/pages/PremiumValuationPage';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import PaymentCancelledPage from '@/pages/PaymentCancelledPage';
import AccessDeniedPage from '@/pages/AccessDeniedPage';
import DealerSignup from '@/pages/dealer/signup';
import LoginDealerPage from '@/pages/LoginDealerPage';
import DealerDashboard from '@/pages/DealerDashboard';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import DealerGuard from '@/guards/DealerGuard';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import UserDashboardPage from '@/pages/UserDashboardPage';

// Import the subscription page
import DealerSubscriptionPage from './components/dealer/SubscriptionPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Index />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/valuation" element={<ValuationPage />} />
      <Route path="/valuation/:valuationId" element={<ValuationPage />} />
      <Route path="/valuation/result/:valuationId" element={<ValuationResultPage />} />
      <Route path="/my-valuations" element={<MyValuationsPage />} />
      <Route path="/valuation/:valuationId/premium" element={<PremiumValuationPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="/dealer-signup" element={<DealerSignup />} />
      <Route path="/login-dealer" element={<LoginDealerPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/user-dashboard" element={<UserDashboardPage />} />
      <Route
        path="/dealer-dashboard"
        element={
          <DealerGuard>
            <DealerDashboard />
          </DealerGuard>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <AdminDashboardPage />
        }
      />
      <Route 
        path="/dealer-subscription" 
        element={
          <DealerGuard>
            <DealerSubscriptionPage />
          </DealerGuard>
        }
      />
    </Route>
  )
);

export default router;
