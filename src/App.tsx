
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
import Dashboard from '@/pages/Dashboard';
import IndividualDashboard from '@/pages/dashboard/IndividualDashboard';
import DealerDashboard from '@/pages/dashboard/DealerDashboard';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import ResultPage from '@/pages/ResultPage';
import ResultsPage from '@/pages/ResultsPage';

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/valuation" element={<ValuationPage />} />
          <Route path="/valuation-result" element={<ValuationResultPage />} />
          <Route path="/valuation/:id" element={<ValuationDetailPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/premium-success" element={<PremiumSuccessPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/individual" element={<IndividualDashboard />} />
          <Route path="/dashboard/dealer" element={<DealerDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
