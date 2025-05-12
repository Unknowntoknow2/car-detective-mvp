
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import router from './App.routes';
import { AuthProvider } from './contexts/AuthContext';
import { DealerOffersTracker } from './components/dealer/DealerOffersTracker';

// Initialize the React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        
        {/* Global notifications components */}
        <Toaster richColors position="top-right" />
        <DealerOffersTracker />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
