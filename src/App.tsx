
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ValuationProvider } from '@/contexts/ValuationContext';
import Layout from '@/components/layout/Layout';
import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import SettingsPage from '@/pages/SettingsPage';
import Dashboard from '@/pages/Dashboard';
import AccessDeniedPage from '@/pages/AccessDeniedPage';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <ValuationProvider>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
          </Route>
        </Routes>
      </ValuationProvider>
    </AuthProvider>
  );
}

export default App;
