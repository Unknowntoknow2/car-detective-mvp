
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
const ValuationResultPage = lazy(() => import('@/pages/ValuationResultPage'));
const ValuationDetailPage = lazy(() => import('@/pages/ValuationDetailPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const DealerDashboard = lazy(() => import('@/pages/dealer/DealerDashboard'));
const DealerLayoutPage = lazy(() => import('@/pages/dealer/DealerLayoutPage'));
const IndividualAuthPage = lazy(() => import('@/pages/auth/IndividualAuthPage'));
const DealerAuthPage = lazy(() => import('@/pages/auth/DealerAuthPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const SigninPage = lazy(() => import('@/pages/auth/SigninPage'));
const PremiumPage = lazy(() => import('@/pages/PremiumPage'));
const UpgradePage = lazy(() => import('@/pages/UpgradePage'));
const UserDashboardPage = lazy(() => import('@/pages/UserDashboardPage'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/valuation" element={<ValuationPage />} />
            <Route path="/vin-lookup" element={<VinLookupPage />} />
            <Route path="/plate-lookup" element={<PlateLookupPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            
            {/* Results pages */}
            <Route path="/results/:id" element={<ResultsPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/valuation/result/:id" element={<ValuationResultPage />} />
            <Route path="/valuation-result/:resultId" element={<ValuationDetailPage />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/individual" element={<IndividualAuthPage />} />
            <Route path="/auth/dealer" element={<DealerAuthPage />} />
            <Route path="/sign-in" element={<SigninPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin/individual" element={<IndividualAuthPage />} />
            <Route path="/signin/dealer" element={<DealerAuthPage />} />
            <Route path="/signup/individual" element={<SignupPage />} />
            <Route path="/signup/dealer" element={<DealerAuthPage />} />
            <Route path="/login" element={<Navigate to="/auth/individual" replace />} />
            <Route path="/register" element={<Navigate to="/auth/individual" replace />} />
            
            {/* User Routes */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/my-valuations" element={<UserDashboardPage />} />
            
            {/* Dealer Routes */}
            <Route path="/dealer" element={<DealerLayoutPage />}>
              <Route index element={<DealerDashboard />} />
              <Route path="dashboard" element={<DealerDashboard />} />
            </Route>
            <Route path="/dealer-dashboard" element={<Navigate to="/dealer" replace />} />
            
            {/* Catch all route - 404 must be at the end */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
