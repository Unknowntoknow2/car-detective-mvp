
import { useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { AuthMode } from '@/types/auth';

export default function AuthPage() {
  const location = useLocation();
  
  // Determine authentication mode based on the URL
  const getAuthMode = (): AuthMode => {
    const path = location.pathname;
    
    if (path.includes('/auth/signup')) return 'signup';
    if (path.includes('/auth/forgot-password')) return 'forgot-password';
    if (path.includes('/auth/reset-password')) return 'reset-password';
    if (path.includes('/auth/forgot-email')) return 'forgot-email';
    
    return 'login'; // Default mode
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <AuthForm mode={getAuthMode()} />
    </div>
  );
}
