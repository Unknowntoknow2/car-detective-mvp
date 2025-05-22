
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import routes from './router'; // Import routes from router.tsx

function App() {
  // Use the routes defined in router.tsx
  const appRoutes = useRoutes(routes);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
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
