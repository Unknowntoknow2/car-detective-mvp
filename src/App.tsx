
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PremiumPage from './pages/PremiumPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import PremiumSuccessPage from './pages/PremiumSuccessPage';
import DealerDashboard from './pages/DealerDashboard';
import DealerOffersPage from './pages/dealer/DealerOffersPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/valuation/premium" element={<PremiumValuationPage />} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/valuation/premium-success" element={<PremiumSuccessPage />} />
          <Route path="/dealer/dashboard" element={<DealerDashboard />} />
          <Route path="/dealer/offers" element={<DealerOffersPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
