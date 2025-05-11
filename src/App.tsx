
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FreeValuationPage from './pages/FreeValuationPage';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import PremiumPage from './pages/PremiumPage';
import UserDashboardPage from './pages/UserDashboardPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import LoginUserPage from './pages/LoginUserPage';
import LoginDealerPage from './pages/LoginDealerPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import DealerDashboard from './pages/DealerDashboard';
import DealerSignup from './pages/DealerSignup';
import { AuthProvider } from './contexts/AuthContext';
import { ValuationProvider } from './contexts/ValuationContext';
import DealerGuard from './guards/DealerGuard';
import AuthRoute from './components/auth/AuthRoute';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ValuationProvider>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/free-valuation" element={<FreeValuationPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/signup" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login-user" element={<LoginUserPage />} />
            <Route path="/login-dealer" element={<LoginDealerPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Fix both dealer signup routes to ensure consistency */}
            <Route path="/dealer-signup" element={<DealerSignup />} />
            <Route path="/signup-dealer" element={<DealerSignup />} />
            
            {/* Redirect dashboard to the proper dashboard based on role */}
            <Route path="/dashboard" element={
              <AuthRoute>
                <DashboardPage />
              </AuthRoute>
            } />
            
            <Route path="/user-dashboard" element={
              <AuthRoute>
                <UserDashboardPage />
              </AuthRoute>
            } />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/premium-valuation" element={<PremiumValuationPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            
            <Route 
              path="/dealer-dashboard" 
              element={
                <DealerGuard>
                  <DealerDashboard />
                </DealerGuard>
              } 
            />
          </Routes>
        </ValuationProvider>
      </AuthProvider>
    </Router>
  );
}
