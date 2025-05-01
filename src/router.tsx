
import React from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import VinLookupPage from './pages/VinLookupPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import NotFoundPage from './pages/NotFound';
import VehicleHistoryPage from './pages/VehicleHistoryPage'; // Import the new page

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
    path: '/vehicle-history',
    element: <VehicleHistoryPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
