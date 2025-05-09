
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthProvider } from './contexts/AuthContext';
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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <AuthProvider>
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/valuation" element={<ValuationPage />} />
                <Route path="/valuation/:valuationId" element={<ValuationDetailPage />} />
                <Route path="/valuation/:valuationId/premium" element={<PremiumValuationPage />} />
                <Route path="/premium" element={<PremiumPage />} />
                <Route path="/valuation/:valuationId/upgrade" element={<UpgradePage />} />
                <Route path="/results" element={<ResultPage />} />
                <Route path="/my-valuations" element={<MyValuationsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/audit" element={<AuditPage />} />
              </Routes>
            </MainLayout>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
