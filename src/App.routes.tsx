
import React from 'react';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import ValuationPage from '@/pages/ValuationPage';
import ValuationResultPage from '@/pages/ValuationResultPage';
import MyValuationsPage from '@/pages/MyValuationsPage';
import PremiumValuationPage from '@/pages/PremiumValuationPage';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import PaymentCancelledPage from '@/pages/PaymentCancelledPage';
import AccessDeniedPage from '@/pages/AccessDeniedPage';
import DealerSignupPage from '@/pages/DealerSignupPage';
import DealerLoginPage from '@/pages/DealerLoginPage';
import DealerDashboard from '@/pages/DealerDashboard';
import DealerGuard from '@/guards/DealerGuard';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminGuard from '@/guards/AdminGuard';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import UpdatePasswordPage from '@/pages/UpdatePasswordPage';
import UserDashboardPage from '@/pages/UserDashboardPage';

// Import the subscription page
import DealerSubscriptionPage from './components/dealer/SubscriptionPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<LandingPage />} />
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
      <Route path="/dealer-signup" element={<DealerSignupPage />} />
      <Route path="/login-dealer" element={<DealerLoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
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
          <AdminGuard>
            <AdminDashboard />
          </AdminGuard>
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
