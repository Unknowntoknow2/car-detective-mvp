
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from './components/ui/toaster'; // for shadcn toasts
import { Toaster as SonnerToaster } from 'sonner'; // for sonner toasts
import { useToast } from './components/ui/use-toast';
import EnhancedErrorBoundary from './components/common/EnhancedErrorBoundary';
import { responsiveUtils } from './utils/responsive-testing';
import { useLocalization } from './i18n/useLocalization';
import './App.css';
import './i18n/config';

// Lazy load pages for better performance
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const UserDashboardPage = lazy(() => import('./pages/UserDashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MyValuationsPage = lazy(() => import('./pages/MyValuationsPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const VinLookupPage = lazy(() => import('./pages/VinLookupPage'));
const PlateLookupPage = lazy(() => import('./pages/PlateLookupPage'));
const ManualLookupPage = lazy(() => import('./pages/ManualLookupPage'));
const PremiumPage = lazy(() => import('./pages/PremiumPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const FreeValuationPage = lazy(() => import('./pages/FreeValuationPage'));
const PremiumSuccessPage = lazy(() => import('./pages/PremiumSuccessPage'));
const PremiumValuationPage = lazy(() => import('./pages/PremiumValuationPage'));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const { toast: toastFn } = useToast();
  const { isRTL } = useLocalization();
  
  // Handle global toast events
  useEffect(() => {
    const handleToast = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        switch (detail.type) {
          case 'success':
            toastFn({ title: detail.title, description: detail.description });
            break;
          case 'error':
            toastFn({ title: detail.title, description: detail.description, variant: 'destructive' });
            break;
          case 'warning':
            toastFn({ title: detail.title, description: detail.description });
            break;
          case 'info':
            toastFn({ title: detail.title, description: detail.description });
            break;
          default:
            toastFn({ title: detail.title, description: detail.description });
        }
      }
    };
    
    document.addEventListener('toast', handleToast);
    
    return () => {
      document.removeEventListener('toast', handleToast);
    };
  }, [toastFn]);

  // Enable responsive testing helper in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Uncomment to enable the responsive testing helper
      // responsiveUtils.enableResponsiveTestingHelper();
    }
    
    return () => {
      responsiveUtils.disableResponsiveTestingHelper();
    };
  }, []);

  // Set RTL direction on document
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  return (
    <EnhancedErrorBoundary context="App">
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-valuations" element={<MyValuationsPage />} />
            <Route path="/vin-lookup" element={<VinLookupPage />} />
            <Route path="/plate-lookup" element={<PlateLookupPage />} />
            <Route path="/manual-lookup" element={<ManualLookupPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/premium-valuation" element={<PremiumValuationPage />} />
            <Route path="/valuation/free" element={<FreeValuationPage />} />
            <Route path="/valuation/premium-success" element={<PremiumSuccessPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        
        {/* Toast components */}
        <Toaster />
        <SonnerToaster />
      </BrowserRouter>
    </EnhancedErrorBoundary>
  );
}

export default App;
