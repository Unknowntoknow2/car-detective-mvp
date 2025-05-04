
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/Home';
import VinLookupPage from './pages/VinLookupPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import NotFoundPage from './pages/NotFound';
import VehicleHistoryPage from './pages/VehicleHistoryPage';
import NicbVinCheckPage from './pages/NicbVinCheckPage';
import VpicDecoderPage from './pages/VpicDecoderPage';
import PremiumPage from './pages/PremiumPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/vin-lookup',
    element: <VinLookupPage />,
  },
  {
    path: '/premium-valuation',
    element: <PremiumValuationPage />,
  },
  {
    path: '/premium',
    element: <PremiumPage />,
  },
  {
    path: '/vehicle-history',
    element: <VehicleHistoryPage />,
  },
  {
    path: "/nicb-check",
    element: <NicbVinCheckPage />,
  },
  {
    path: "/vpic-decode",
    element: <VpicDecoderPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
