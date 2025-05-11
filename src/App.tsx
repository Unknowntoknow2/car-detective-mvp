
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FreeValuationPage from './pages/FreeValuationPage';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PremiumPage from './pages/PremiumPage';
import UserDashboardPage from './pages/UserDashboardPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import { AuthProvider } from './contexts/AuthContext';
import { ValuationProvider } from './contexts/ValuationContext';

export default function App() {
  return (
    <AuthProvider>
      <ValuationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/free-valuation" element={<FreeValuationPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/signup" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/user-dashboard" element={<UserDashboardPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/premium-valuation" element={<PremiumValuationPage />} />
        </Routes>
      </ValuationProvider>
    </AuthProvider>
  );
}
