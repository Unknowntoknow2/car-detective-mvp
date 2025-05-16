
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import ValuationPage from '@/pages/ValuationPage';
import ValuationDetailPage from '@/pages/ValuationDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Premium from '@/pages/Premium';
import PremiumSuccessPage from '@/pages/PremiumSuccessPage';
import ResultPage from '@/pages/ResultPage';
import MyValuationsPage from '@/pages/MyValuationsPage';
import Dashboard from '@/pages/Dashboard';
import IndividualDashboard from '@/pages/dashboard/IndividualDashboard';
import DealerDashboard from '@/pages/dashboard/DealerDashboard';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/valuation" element={<ValuationPage />} />
        <Route path="/valuation/:id" element={<ValuationDetailPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/results/:id" element={<ValuationDetailPage />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/premium-success" element={<PremiumSuccessPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/individual" element={<IndividualDashboard />} />
        <Route path="/dashboard/dealer" element={<DealerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/my-valuations" element={<MyValuationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
