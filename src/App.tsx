
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import VinLookupPage from './pages/VinLookupPage';
import LookupPage from './pages/LookupPage';
import ValuationFollowUpPage from './pages/ValuationFollowUpPage';
import ValuationResultPage from './pages/ValuationResultPage';

// Import other pages as needed

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LookupPage />} />
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
