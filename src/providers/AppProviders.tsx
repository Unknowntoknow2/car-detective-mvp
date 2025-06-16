// /src/providers/AppProviders.tsx
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { ToastProvider } from "@/components/ui/use-toast";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
