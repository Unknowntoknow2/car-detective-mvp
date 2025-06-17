import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { Toaster } from 'sonner';

import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AuthPage from '@/pages/AuthPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ValuationPage from '@/pages/ValuationPage';
import PremiumPage from '@/pages/PremiumPage';
import PhotoAnalysisPage from '@/pages/PhotoAnalysisPage';
import VehicleLookupPage from '@/pages/VehicleLookupPage';
import DealerDashboardPage from '@/pages/DealerDashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import LoginUserPage from '@/pages/LoginUserPage';
import LoginDealerPage from '@/pages/LoginDealerPage';
import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/hooks/useAuth';

function App() {
  return (
    <Router>
      <QueryClient>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/valuation" element={<ValuationPage />} />
                <Route path="/premium" element={<PremiumPage />} />
                <Route path="/photo-analysis" element={<PhotoAnalysisPage />} />
                <Route path="/vehicle-lookup" element={<VehicleLookupPage />} />
                <Route path="/dealer-dashboard" element={<DealerDashboardPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/login-user" element={<LoginUserPage />} />
                <Route path="/login-dealer" element={<LoginDealerPage />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </AuthProvider>
      </QueryClient>
    </Router>
  );
}

export default App;
