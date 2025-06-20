
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import AuthPage from '@/pages/AuthPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import PremiumPage from '@/pages/PremiumPage';
import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/hooks/useAuth';
import { ValuationProvider } from '@/contexts/ValuationContext';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ValuationProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/premium" element={<PremiumPage />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </ValuationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
