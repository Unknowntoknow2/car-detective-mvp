
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ValuationPage from '@/pages/ValuationPage';
import ValuationResultPage from '@/pages/ValuationResultPage';
import ValuationDetailPage from '@/pages/ValuationDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PremiumPage from '@/pages/Premium';
import PremiumSuccessPage from '@/pages/PremiumSuccessPage';
import AppLayout from '@/components/layout/AppLayout';
import { AppProviders } from '@/providers/AppProviders';

function App() {
  return (
    <AppProviders>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/valuation" element={<ValuationPage />} />
          <Route path="/valuation-result" element={<ValuationResultPage />} />
          <Route path="/valuation/:id" element={<ValuationDetailPage />} />
          <Route path="/result" element={<ValuationResultPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/premium-success" element={<PremiumSuccessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppProviders>
  );
}

export default App;
