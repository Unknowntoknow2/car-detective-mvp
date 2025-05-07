import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import ValuationPage from './pages/ValuationPage';
import PremiumPage from './pages/PremiumPage';
import UpgradePage from './pages/UpgradePage';
import ProfilePage from './pages/ProfilePage';
import VehicleHistoryPage from './pages/VehicleHistoryPage';
import MyValuationsPage from './pages/MyValuationsPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthLayout } from './modules/auth/AuthLayout';
import SignInPage from './modules/auth/SignInPage';
import SignUpPage from './modules/auth/SignUpPage';
import ForgotPasswordPage from './modules/auth/ForgotPasswordPage';
import ResetPasswordPage from './modules/auth/ResetPasswordPage';
import ConfirmationPage from './modules/auth/ConfirmationPage';
import { withAuth } from './modules/auth/withAuth';
import AdminAnalyticsDashboard from './components/admin/dashboard/AdminAnalyticsDashboard';
import { DesignSystemPage } from './pages/DesignSystem';
import { PremiumValuationPage } from './pages/PremiumValuationPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="valuation" element={<ValuationPage />} />
        <Route path="premium" element={<PremiumPage />} />
        <Route path="premium-valuation" element={<PremiumValuationPage />} />
        <Route path="upgrade" element={<UpgradePage />} />
        <Route path="profile" element={withAuth(ProfilePage)} />
        <Route path="vehicle-history" element={withAuth(VehicleHistoryPage)} />
        <Route path="my-valuations" element={withAuth(MyValuationsPage)} />
        <Route path="design-system" element={<DesignSystemPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route
          path="confirmation"
          element={<ConfirmationPage
            title="Email Confirmed"
            message="Your email has been confirmed successfully."
            buttonText="Go to Login"
            buttonHref="/auth/signin"
          />}
        />
      </Route>

      <Route
        path="/admin"
        element={withAuth(AdminAnalyticsDashboard, ['admin'])}
      />
    </>
  )
);

export default router;
