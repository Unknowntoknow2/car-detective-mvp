
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Loading from '@/components/Loading';
import NotFoundPage from '@/pages/NotFoundPage';

// Lazy load pages to improve initial load time
const HomePage = lazy(() => import('@/pages/HomePage'));
const ValuationPage = lazy(() => import('@/pages/ValuationPage'));
const VinLookupPage = lazy(() => import('@/pages/VinLookupPage'));
const PlateLookupPage = lazy(() => import('@/pages/PlateLookupPage'));
const ResultsPage = lazy(() => import('@/pages/ResultsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const DealerDashboard = lazy(() => import('@/pages/dealer/DealerDashboard'));
const DealerLayoutPage = lazy(() => import('@/pages/dealer/DealerLayoutPage'));
const IndividualAuthPage = lazy(() => import('@/pages/auth/IndividualAuthPage'));
const DealerAuthPage = lazy(() => import('@/pages/auth/DealerAuthPage'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/valuation" element={<ValuationPage />} />
            <Route path="/vin-lookup" element={<VinLookupPage />} />
            <Route path="/plate-lookup" element={<PlateLookupPage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
            <Route path="/results" element={<ResultsPage />} />
            
            {/* Auth Routes */}
            <Route path="/auth/individual" element={<IndividualAuthPage />} />
            <Route path="/auth/dealer" element={<DealerAuthPage />} />
            <Route path="/auth" element={<Navigate to="/auth/individual" replace />} />
            <Route path="/sign-in" element={<Navigate to="/auth/individual" replace />} />
            <Route path="/sign-up" element={<Navigate to="/auth/individual" replace />} />
            <Route path="/login" element={<Navigate to="/auth/individual" replace />} />
            <Route path="/register" element={<Navigate to="/auth/individual" replace />} />
            
            {/* User Routes */}
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Dealer Routes */}
            <Route path="/dealer" element={<DealerLayoutPage />}>
              <Route index element={<DealerDashboard />} />
              <Route path="dashboard" element={<DealerDashboard />} />
            </Route>
            
            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
