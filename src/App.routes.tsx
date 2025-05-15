import React from 'react';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import VinLookupPage from './pages/VinLookupPage';
import ValuationPage from './pages/ValuationPage';
import ValuationResultPage from './pages/ValuationResultPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import DealerDashboard from './pages/dealer/DealerDashboard';
import DealerInventoryPage from './pages/dealer/DealerInventoryPage';
import DealerVehicleDetailsPage from './pages/dealer/DealerVehicleDetailsPage';
import DealerLayoutPage from './pages/dealer/DealerLayoutPage';
import { ReactNodeWrapper } from './components/layout/ReactNodeWrapper';
import NicbVinCheckPage from './pages/NicbVinCheckPage';
import ServiceHistoryPage from './pages/ServiceHistoryPage';
import AuthTestPage from './pages/AuthTestPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomePage />} >
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="valuation" element={<ValuationPage />} />
      <Route path="valuation/:valuationId" element={<ValuationResultPage />} />
      <Route path="valuation/vin" element={<VinLookupPage />} />
      <Route path="premium-valuation" element={<PremiumValuationPage />} />
      <Route path="vin-lookup" element={<VinLookupPage />} />
      <Route path="nicb-vin-check" element={<NicbVinCheckPage />} />
      <Route path="service-history" element={<ServiceHistoryPage />} />
      <Route path="auth-test" element={<AuthTestPage />} />
      
      <Route path="dealer" element={<DealerLayoutPage />} >
        <Route index element={<DealerDashboard />} />
        <Route path="inventory" element={<DealerInventoryPage />} />
        <Route path="inventory/:vehicleId" element={<DealerVehicleDetailsPage />} />
      </Route>
    </Route>
  )
);

// Fix the ReactNodeWrapper usage by adding children prop
const DealerLayout = () => (
  <ReactNodeWrapper>
    <Outlet />
  </ReactNodeWrapper>
);

export default router;
