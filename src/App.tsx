
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FreeValuationPage from './pages/FreeValuationPage';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
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
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ValuationProvider>
          <Toaster position="top-center" richColors />
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/free-valuation" element={<MainLayout><FreeValuationPage /></MainLayout>} />
            <Route path="/auth" element={<MainLayout><AuthPage /></MainLayout>} />
            <Route path="/auth/signup" element={<MainLayout><RegisterPage /></MainLayout>} />
            <Route path="/auth/forgot-password" element={<MainLayout><ForgotPasswordPage /></MainLayout>} />
            <Route path="/auth/reset-password" element={<MainLayout><ResetPasswordPage /></MainLayout>} />
            <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
            <Route path="/login-user" element={<MainLayout><LoginUserPage /></MainLayout>} />
            <Route path="/login-dealer" element={<MainLayout><LoginDealerPage /></MainLayout>} />
            <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
            
            {/* Consolidate dealer signup routes to one clear route */}
            <Route path="/dealer-signup" element={<MainLayout><DealerSignup /></MainLayout>} />
            <Route path="/signup-dealer" element={<MainLayout><DealerSignup /></MainLayout>} />
            
            {/* Dashboard for regular users */}
            <Route path="/dashboard" element={
              <AuthRoute>
                <MainLayout><Dashboard /></MainLayout>
              </AuthRoute>
            } />
            
            <Route path="/user-dashboard" element={
              <AuthRoute>
                <MainLayout><UserDashboardPage /></MainLayout>
              </AuthRoute>
            } />
            <Route path="/premium" element={<MainLayout><PremiumPage /></MainLayout>} />
            <Route path="/premium-valuation" element={<MainLayout><PremiumValuationPage /></MainLayout>} />
            <Route path="/access-denied" element={<MainLayout><AccessDeniedPage /></MainLayout>} />
            
            {/* Dashboard for dealers with appropriate guard */}
            <Route 
              path="/dealer-dashboard" 
              element={
                <DealerGuard>
                  <MainLayout><DealerDashboard /></MainLayout>
                </DealerGuard>
              } 
            />
          </Routes>
        </ValuationProvider>
      </AuthProvider>
    </Router>
  );
}
