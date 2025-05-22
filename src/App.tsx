
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import routes from './router';
import { Toaster } from 'sonner';

function App() {
  // Use the routes configuration
  const appRoutes = useRoutes(routes);

  // Add diagnostic logging to help with debugging
  console.log('✅ App rendering with routes');

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
