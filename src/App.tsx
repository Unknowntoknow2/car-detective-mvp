
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
const SigninPage = lazy(() => import('@/pages/auth/SigninPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const DealerDashboard = lazy(() => import('@/pages/dealer/DealerDashboard'));
const DealerLayoutPage = lazy(() => import('@/pages/dealer/DealerLayoutPage'));
const AuthPage = lazy(() => import('@/pages/auth/IndividualAuthPage'));
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
            <Route path="/sign-in" element={<SigninPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/auth/individual" element={<AuthPage />} />
            <Route path="/auth/dealer" element={<DealerAuthPage />} />
            <Route path="/auth" element={<Navigate to="/auth/individual" replace />} />
            
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
