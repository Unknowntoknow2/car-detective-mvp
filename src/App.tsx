
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ValuationPage from './pages/ValuationPage';
import PremiumPage from './pages/PremiumPage';
import PremiumResultsPage from './pages/PremiumResultsPage';
import ValuationFollowUp from './pages/ValuationFollowUp';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/valuation" element={<ValuationPage />} />
        <Route path="/valuation-followup" element={<ValuationFollowUp />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/premium-results/:valuationId" element={<PremiumResultsPage />} />
      </Routes>
    </Router>
  );
}
