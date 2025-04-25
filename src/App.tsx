
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import UserDashboardPage from './pages/UserDashboardPage';
import ProfilePage from './pages/ProfilePage';
import MyValuationsPage from './pages/MyValuationsPage';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import VinLookupPage from './pages/VinLookupPage';
import PlateLookupPage from './pages/PlateLookupPage';
import ManualLookupPage from './pages/ManualLookupPage';
import PremiumPage from './pages/PremiumPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FreeValuationPage from './pages/FreeValuationPage';
import PremiumSuccessPage from './pages/PremiumSuccessPage';
import PremiumValuationPage from './pages/PremiumValuationPage';

import { Toaster } from './components/ui/toaster'; // for shadcn toasts
import { Toaster as SonnerToaster } from 'sonner'; // for sonner toasts
import './App.css';

import './i18n/config';
import { useEffect } from 'react';
import { toast, useToast } from './components/ui/use-toast';

function App() {
  const { toast: toastFn } = useToast();
  
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

  return (
    <BrowserRouter>
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
      
      {/* Toast components */}
      <Toaster />
      <SonnerToaster />
    </BrowserRouter>
  );
}

export default App;
