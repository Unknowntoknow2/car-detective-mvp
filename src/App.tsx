import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/auth/RegisterPage';
import DealerSignupPage from './pages/auth/DealerSignupPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ValuationPage from './pages/ValuationPage';
import ValuationResultPage from './pages/ValuationResultPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import MyValuationsPage from './pages/MyValuationsPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import PremiumSuccessPage from './pages/PremiumSuccessPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dealer-signup" element={<DealerSignupPage />} />
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/valuation" element={<ValuationPage />} />
              <Route path="/valuation/:valuationId" element={<ValuationResultPage />} />
              <Route path="/valuation/:valuationId/premium" element={<PremiumValuationPage />} />
              <Route path="/my-valuations" element={<MyValuationsPage />} />
              <Route path="/account/settings" element={<AccountSettingsPage />} />
              
              {/* Premium Payment Flow */}
              <Route path="/premium-success" element={<PremiumSuccessPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
