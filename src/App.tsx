
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UpgradePage from './pages/UpgradePage';
import PremiumPage from './pages/PremiumPage';
import PremiumSuccessPage from './pages/PremiumSuccessPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ValuationFollowupPage from './pages/ValuationFollowupPage'; // Using consistent lowercase 'up'
import ValuationResultPage from './pages/ValuationResultPage';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/premium-success" element={<PremiumSuccessPage />} />
        <Route path="/upgrade" element={<UpgradePage />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/valuation-followup" element={<ValuationFollowupPage />} />
        <Route path="/valuation-result" element={<ValuationResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
