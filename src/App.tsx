
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import { Toaster } from 'sonner';

// ✅ Case-sensitive imports — ensure these files are named exactly:
//    SignUpPage.tsx  and SignInPage.tsx
import SignUpPage from '@/pages/auth/SignUpPage';
import SignInPage from '@/pages/auth/SignInPage';
import AccessDeniedPage from '@/pages/auth/AccessDeniedPage';

import Dashboard from '@/pages/dashboard/Dashboard';
import DealerDashboardRoutes from '@/pages/dealer/DealerDashboardRoutes';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { AuthProvider } from '@/components/auth/AuthProvider'; // Updating import to use the correct AuthProvider

const App = () => {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

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
    </AuthProvider>
  );
};

export default App;
