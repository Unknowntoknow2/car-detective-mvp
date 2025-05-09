
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ValuationPage from './pages/ValuationPage';
import PremiumPage from './pages/PremiumPage';
import ResultPage from './pages/ResultPage';
import DashboardPage from './pages/DashboardPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelledPage from './pages/PaymentCancelledPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import ValuationDetailPage from './pages/ValuationDetailPage'; 
import MyValuationsPage from './pages/MyValuationsPage';
import ProfilePage from './pages/ProfilePage';
import OffersPage from './pages/OffersPage';
import UpgradePage from './pages/UpgradePage';
import AuditPage from './pages/AuditPage';
import AuthPage from './pages/AuthPage';
import AuthTestPage from './pages/AuthTestPage';
import AuthCallback from './components/auth/AuthCallback';
import { AuthRoute } from './components/auth/AuthRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/valuation" element={<ValuationPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/auth-test" element={<AuthTestPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<AuthRoute><DashboardPage /></AuthRoute>} />
              <Route path="/profile" element={<AuthRoute><ProfilePage /></AuthRoute>} />
              <Route path="/my-valuations" element={<AuthRoute><MyValuationsPage /></AuthRoute>} />
              <Route path="/valuation/:valuationId" element={<AuthRoute><ValuationDetailPage /></AuthRoute>} />
              <Route path="/valuation/:valuationId/premium" element={<AuthRoute><PremiumValuationPage /></AuthRoute>} />
              <Route path="/valuation/:valuationId/upgrade" element={<AuthRoute><UpgradePage /></AuthRoute>} />
              <Route path="/results" element={<AuthRoute><ResultPage /></AuthRoute>} />
              <Route path="/payment-success" element={<AuthRoute><PaymentSuccessPage /></AuthRoute>} />
              <Route path="/payment-cancelled" element={<AuthRoute><PaymentCancelledPage /></AuthRoute>} />
              <Route path="/offers" element={<AuthRoute><OffersPage /></AuthRoute>} />
              <Route path="/audit" element={<AuthRoute><AuditPage /></AuthRoute>} />
            </Routes>
            <Toaster position="top-right" closeButton richColors />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
