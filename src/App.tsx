
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Premium from './pages/Premium';
import PremiumValuationPage from './pages/PremiumValuationPage';
import MyValuationsPage from './pages/MyValuationsPage';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import VinLookupPage from './pages/VinLookupPage';
import ValuationResultPage from './pages/ValuationResultPage';
import FreeValuationPage from './pages/FreeValuationPage';
import { ValuationProvider } from './contexts/ValuationContext';

export default function App() {
  return (
    <BrowserRouter>
      <ValuationProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/free" element={<FreeValuationPage />} />
          <Route path="/free-valuation" element={<FreeValuationPage />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/premium-valuation" element={<PremiumValuationPage />} />
          <Route path="/my-valuations" element={<MyValuationsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/vin-lookup" element={<VinLookupPage />} />
          <Route path="/result" element={<ValuationResultPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ValuationProvider>
    </BrowserRouter>
  );
}
