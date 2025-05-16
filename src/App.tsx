
import { Routes, Route } from 'react-router-dom';
// src/pages/HomePage.tsx
import { EnhancedHomePage } from '@/components/home/EnhancedHomePage';

export default EnhancedHomePage;
import { Toaster } from 'sonner';

// Auth pages - with case-sensitive imports
import SignUpPage from '@/pages/auth/SignUpPage';
import SignInPage from '@/pages/auth/SignInPage';
import AccessDeniedPage from '@/pages/auth/AccessDeniedPage';
import Premium from '@/pages/Premium';

import Dashboard from '@/pages/dashboard/Dashboard';
import DealerDashboardRoutes from '@/pages/dealer/DealerDashboardRoutes';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { AuthProvider } from '@/contexts/AuthContext';

const App = () => {
  console.log('🔄 App component rendering...');
  
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <div className="app-root">
        <Routes>
          {/* Public Routes - with fallback rendering */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="/premium" element={<Premium />} />

          {/* Protected User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            }
          />

          {/* Protected Dealer Dashboard */}
          <Route
            path="/dealer/*"
            element={
              <AuthenticatedLayout requireRole="dealer">
                <DealerDashboardRoutes />
              </AuthenticatedLayout>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
