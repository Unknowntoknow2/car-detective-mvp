
import React, { useEffect } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import routes from './router';
import { Toaster } from 'sonner';

function App() {
  // Use the routes configuration
  const appRoutes = useRoutes(routes);
  const location = useLocation();

  // Add diagnostic logging to help with debugging
  useEffect(() => {
    console.log('✅ App rendering with current route:', location.pathname);
  }, [location]);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Toaster richColors position="top-center" />
        <Navbar />
        <main className="flex-1">
          {appRoutes}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
