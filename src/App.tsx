// /src/App.tsx ✅ CLEANED UP
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import AppProviders from './providers/AppProviders';
import routes from '@/App.routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  const renderRoutes = (routeConfigs: any[]) =>
    routeConfigs.map((route, index) =>
      route.index ? (
        <Route key={index} index element={route.element} />
      ) : route.children ? (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      ) : (
        <Route key={index} path={route.path} element={route.element} />
      )
    );

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col bg-background">
              <Navbar />
              <main className="flex-grow">
                <Routes>{renderRoutes(routes)}</Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AppProviders>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
