
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import { Toaster } from 'sonner';
import SignUpPage from '@/pages/auth/SignUpPage';
import SignInPage from '@/pages/auth/SignInPage';
import DealerSignupPage from '@/pages/auth/DealerSignupPage';
import LoginDealerPage from '@/pages/auth/LoginDealerPage';
import Dashboard from '@/pages/dashboard/Dashboard';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import DealerDashboardRoutes from '@/pages/dealer/DealerDashboardRoutes';
import AccessDeniedPage from '@/pages/auth/AccessDeniedPage';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/dealer/sign-up" element={<DealerSignupPage />} />
        <Route path="/dealer/sign-in" element={<LoginDealerPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        
        {/* Protected routes for regular users */}
        <Route 
          path="/dashboard" 
          element={
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          } 
        />
        
        {/* Protected routes for dealers */}
        <Route 
          path="/dealer/*" 
          element={
            <AuthenticatedLayout requireRole="dealer">
              <DealerDashboardRoutes />
            </AuthenticatedLayout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
