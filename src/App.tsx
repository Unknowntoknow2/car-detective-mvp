
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import VinLookupPage from './pages/VinLookupPage';
import LookupPage from './pages/LookupPage';
import ValuationFollowUpPage from './pages/ValuationFollowUpPage';
import ValuationResultPage from './pages/ValuationResultPage';
import { EnhancedHomePage } from './components/home/EnhancedHomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
        <Route index element={<EnhancedHomePage />} />
        <Route path="/lookup" element={<LookupPage />} />
        <Route path="/vin-lookup" element={<VinLookupPage />} />
        <Route path="/valuation-followup" element={<ValuationFollowUpPage />} />
        <Route path="/valuation-result" element={<ValuationResultPage />} />
        {/* Add other routes as needed */}
      </Route>
    </Routes>
  );
}

export default App;
