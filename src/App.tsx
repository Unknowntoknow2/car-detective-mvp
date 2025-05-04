
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/toaster'; // for shadcn toasts
import { Toaster as SonnerToaster } from 'sonner'; // for sonner toasts
import { useToast } from './components/ui/use-toast';
import EnhancedErrorBoundary from './components/common/EnhancedErrorBoundary';
import { responsiveUtils } from './utils/responsive-testing';
import { useLocalization } from './i18n/useLocalization';
import router from './router';
import './App.css';
import './i18n/config';
import { useEffect } from 'react';

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
      <RouterProvider router={router} />
      
      {/* Toast components */}
      <Toaster />
      <SonnerToaster />
    </EnhancedErrorBoundary>
  );
}

export default App;
