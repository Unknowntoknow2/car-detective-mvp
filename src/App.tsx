// ✅ File: src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/layout/AppLayout';

import HomePage from '@/pages/HomePage';
import ValuationPage from '@/pages/ValuationPage';
import ValuationResultPage from '@/pages/ValuationResultPage';
import ValuationDetailPage from '@/pages/ValuationDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PremiumPage from '@/pages/Premium';
import PremiumSuccessPage from '@/pages/PremiumSuccessPage';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/valuation" element={<ValuationPage />} />
        <Route path="/result" element={<ValuationResultPage />} />
        <Route path="/valuation/detail/:id" element={<ValuationDetailPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/premium/success" element={<PremiumSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </AppLayout>
  );
}

export default App;
