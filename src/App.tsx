
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/hooks/useAuth';
import { ValuationProvider } from '@/contexts/ValuationContext';
import { EnhancedErrorBoundary } from '@/components/common/EnhancedErrorBoundary';
import { PreviewFallback } from '@/components/common/PreviewFallback';
import routes from './App.routes';

const queryClient = new QueryClient();

// Layout component that includes Header
function Layout() {
  return (
    <EnhancedErrorBoundary context="App Layout">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </EnhancedErrorBoundary>
  );
}

// Create the router with the comprehensive route configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: routes[0].children,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ValuationProvider>
          <PreviewFallback>
            <RouterProvider router={router} />
            <Toaster />
          </PreviewFallback>
        </ValuationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
