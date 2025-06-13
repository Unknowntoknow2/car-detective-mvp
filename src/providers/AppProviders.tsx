
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from '@/components/ui/use-toast';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
