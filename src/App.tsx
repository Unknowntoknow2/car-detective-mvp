
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import ValuationPage from '@/pages/ValuationPage';
import ValuationResultPage from '@/pages/ValuationResultPage';
import ValuationDetailPage from '@/pages/ValuationDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Premium from '@/pages/Premium';
import PremiumSuccessPage from '@/pages/PremiumSuccessPage';
import AppLayout from '@/components/layout/AppLayout';

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/valuation" element={<ValuationPage />} />
          <Route path="/valuation-result" element={<ValuationResultPage />} />
          <Route path="/valuation/:id" element={<ValuationDetailPage />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/premium-success" element={<PremiumSuccessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
