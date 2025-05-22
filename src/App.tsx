
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Auth pages
import AuthPage from './pages/auth/AuthPage';
import SigninPage from './pages/auth/SigninPage';
import SignupPage from './pages/auth/SignupPage';

// Dashboard pages
import DashboardPage from './pages/DashboardPage';

function App() {
  // Define the routes
  const appRoutes = useRoutes([
    // Main pages
    { path: '/', element: <div>Home Page</div> },
    
    // Auth routes
    { path: '/auth', element: <AuthPage /> },
    { path: '/signin/:role', element: <SigninPage /> },
    { path: '/signup/:role', element: <SignupPage /> },
    
    // Backwards compatibility - redirect old routes
    { path: '/login-user', element: <SigninPage /> },
    { path: '/login-dealer', element: <SigninPage /> },
    { path: '/register', element: <SignupPage /> },
    { path: '/dealer-signup', element: <SignupPage /> },
    
    // Dashboard routes
    { path: '/dashboard', element: <DashboardPage /> },
    { path: '/dealer/dashboard', element: <div>Dealer Dashboard</div> },
    
    // Fallback route
    { path: '*', element: <div>Page Not Found</div> }
  ]);

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
