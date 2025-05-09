
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingComponent from './components/ui/loading-component';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ui/theme-provider';
import { AuthProvider } from './contexts/AuthContext';
import { ValuationProvider } from './contexts/ValuationContext';

// Lazy-loaded pages
const Index = lazy(() => import('./pages/Index'));
const ValuationPage = lazy(() => import('./pages/ValuationPage'));
const PremiumPage = lazy(() => import('./pages/PremiumPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PremiumValuationPage = lazy(() => import('./pages/PremiumValuationPage'));
const MyValuationsPage = lazy(() => import('./pages/MyValuationsPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <ValuationProvider>
            <Suspense fallback={<LoadingComponent />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/valuation" element={<ValuationPage />} />
                <Route path="/premium" element={<PremiumPage />} />
                <Route path="/premium-valuation" element={<PremiumValuationPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/my-valuations" element={<MyValuationsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ValuationProvider>
        </AuthProvider>
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;
