import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Loading from './components/ui/Loading';

const HomePage = lazy(() => import('./pages/HomePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const VinLookupPage = lazy(() => import('./pages/VinLookupPage'));
const PremiumValuationPage = lazy(() => import('./pages/PremiumValuationPage'));
const PremiumConditionPage = lazy(() => import('./pages/PremiumConditionPage'));
const MyValuationsPage = lazy(() => import('./pages/MyValuationsPage'));
const EquipmentPage = lazy(() => import('./pages/EquipmentPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ValuationResultPage = lazy(() => import('./pages/ValuationResultPage'));
const FreeValuationPage = lazy(() => import('./pages/FreeValuationPage'));

// Define the routes
export const routes = [
  {
    path: '/',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <HomePage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '/contact',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <ContactPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '/about',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <AboutPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '/vin-lookup',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <VinLookupPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '/premium',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <PremiumValuationPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '/premium/condition',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <PremiumConditionPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '/my-valuations',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <MyValuationsPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '/equipment',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <EquipmentPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '/valuation-result/:id',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <ValuationResultPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '/free',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <FreeValuationPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '/404',
    element: (
      <MainLayout>
        <Suspense fallback={<Loading />}>
          <NotFoundPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

export default routes;
