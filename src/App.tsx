
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ValuationProvider } from './contexts/ValuationContext';
import { DealerOffersTracker } from './components/dealer/DealerOffersTracker';
import MainLayout from './layouts/MainLayout';
import ValuationDetailPage from './pages/ValuationDetailPage';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import DealerDashboard from './pages/DealerDashboard';
import ViewOfferPage from './pages/view-offer/[token]';
import SharedValuationPage from './pages/share/[token]';

// Initialize the React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ValuationProvider>
            <Routes>
              <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
              <Route path="/valuation/:valuationId" element={<MainLayout><ValuationDetailPage /></MainLayout>} />
              <Route path="/auth/*" element={<AuthLayout />} />
              <Route path="/dashboard/*" element={<DashboardLayout />} />
              <Route path="/dealer-dashboard" element={<MainLayout><DealerDashboard /></MainLayout>} />
              <Route path="/view-offer/:token" element={<MainLayout><ViewOfferPage /></MainLayout>} />
              <Route path="/share/:token" element={<MainLayout><SharedValuationPage /></MainLayout>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Global notifications components */}
            <Toaster richColors position="top-right" />
            <DealerOffersTracker />
          </ValuationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
