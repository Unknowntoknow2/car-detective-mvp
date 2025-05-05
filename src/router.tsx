
import { createBrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import PremiumPage from '@/pages/PremiumPage';
import Home from '@/pages/Home';
import ManualLookupPage from '@/pages/ManualLookupPage';
import NotFound from '@/pages/NotFound';
import VinLookupPage from '@/pages/VinLookupPage';
import VpicDecoderPage from '@/pages/VpicDecoderPage';
import PlateLookupPage from '@/pages/PlateLookupPage';
import VehicleHistoryPage from '@/pages/VehicleHistoryPage';
import PremiumValuationPage from '@/pages/PremiumValuationPage';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import PremiumSuccessPage from '@/pages/PremiumSuccessPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardPage from '@/pages/UserDashboardPage';
import MyValuationsPage from '@/pages/MyValuationsPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import AdminPage from '@/pages/AdminPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/premium',
    element: <PremiumPage />,
  },
  {
    path: '/vin-lookup',
    element: <VinLookupPage />,
  },
  {
    path: '/manual-lookup',
    element: <ManualLookupPage />,
  },
  {
    path: '/vpic-decode',
    element: <VpicDecoderPage />,
  },
  {
    path: '/plate-lookup',
    element: <PlateLookupPage />,
  },
  {
    path: '/vehicle-history',
    element: <VehicleHistoryPage />,
  },
  {
    path: '/premium-valuation',
    element: <PremiumValuationPage />,
  },
  {
    path: '/premium-success',
    element: <PremiumSuccessPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <UserDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-valuations',
    element: (
      <ProtectedRoute>
        <MyValuationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
