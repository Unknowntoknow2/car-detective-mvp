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
import ProfilePage from './pages/ProfilePage';
import OffersPage from './pages/OffersPage';
import UpgradePage from './pages/UpgradePage';
import AuditPage from './pages/AuditPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <AuthProvider>
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/valuation" element={<ValuationPage />} />
                <Route path="/valuation/:valuationId" element={<ValuationPage />} />
                <Route path="/valuation/premium" element={<PremiumPage />} />
                <Route path="/valuation/:valuationId/upgrade" element={<UpgradePage />} />
                <Route path="/results" element={<ResultPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
                <Route path="/valuation/premium" element={<PremiumValuationPage />} />
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
