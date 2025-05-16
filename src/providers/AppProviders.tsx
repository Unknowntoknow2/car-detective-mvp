
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ValuationProvider } from '@/contexts/ValuationContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <ValuationProvider>
        {children}
        <Toaster />
        <SonnerToaster position="top-right" />
      </ValuationProvider>
    </ThemeProvider>
  );
};
