import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ValuationPage from './pages/ValuationPage';
import PremiumPage from './pages/PremiumPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import PremiumSuccessPage from './pages/PremiumSuccessPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/valuation" element={<ValuationPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/valuation/premium" element={<PremiumValuationPage />} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/valuation/premium-success" element={<PremiumSuccessPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
