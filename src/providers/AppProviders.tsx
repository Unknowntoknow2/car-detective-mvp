import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ToastProvider } from '@/components/ui/use-toast';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default AppProviders; // ✅ This line fixes your error
