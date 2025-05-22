
import React from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ValuationProvider } from '@/hooks/useValuationContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ValuationProvider>
          <TooltipProvider>
            {children}
            <Toaster />
            <SonnerToaster position="top-right" />
          </TooltipProvider>
        </ValuationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
