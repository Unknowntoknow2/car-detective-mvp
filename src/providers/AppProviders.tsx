
import React from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ValuationProvider } from '@/hooks/useValuationContext';
import { AuthProvider } from '@/contexts/AuthContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Provide default values for the ValuationProvider
  const valuationProviderDefaultValues = {
    vehicle: null,
    valuationId: null,
    isLoading: false,
    setVehicle: () => {},
    setValuationId: () => {},
    setIsLoading: () => {},
    clearValuation: () => {},
    saveValuationToHistory: () => {},
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <ValuationProvider>
          {children}
          <Toaster />
          <SonnerToaster position="top-right" />
        </ValuationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
