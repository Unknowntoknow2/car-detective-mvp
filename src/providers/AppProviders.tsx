import * as React from 'react';

import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <HelmetProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          theme="system"
        />
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
