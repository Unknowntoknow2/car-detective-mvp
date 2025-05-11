
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FreeValuationPage from './pages/FreeValuationPage';
import { AuthProvider } from './contexts/AuthContext';
import { ValuationProvider } from './contexts/ValuationContext';

export default function App() {
  return (
    <AuthProvider>
      <ValuationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/free-valuation" element={<FreeValuationPage />} />
          {/* Add other routes as needed */}
        </Routes>
      </ValuationProvider>
    </AuthProvider>
  );
}
