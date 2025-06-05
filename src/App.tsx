// ✅ src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AINAssistantTrigger } from '@/components/chat/AINAssistantTrigger';
import routes from '@/router';

const queryClient = new QueryClient();

function App() {
  const renderRoutes = (routeConfigs: any[]) => {
    return routeConfigs.map((route, index) => {
      if (route.index) {
        return <Route key={index} index element={route.element} />;
      }

      if (route.children) {
        return (
          <Route key={index} path={route.path} element={route.element}>
            {renderRoutes(route.children)}
          </Route>
        );
      }

      return <Route key={index} path={route.path} element={route.element} />;
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow">
              <Routes>{renderRoutes(routes)}</Routes>
            </main>
            <Footer />
            <AINAssistantTrigger />
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
