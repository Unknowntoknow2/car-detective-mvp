
import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { AuthMode } from '@/types/auth';
import { Toaster } from 'sonner';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Determine auth mode from URL parameters or path
  const modeParam = searchParams.get('mode');
  const initialMode = modeParam === 'signup' 
    ? AuthMode.SIGNUP 
    : (location.pathname.includes('signup') ? AuthMode.SIGNUP : AuthMode.SIGNIN);
  
  // Determine role from URL parameters or path
  const roleParam = searchParams.get('role');
  const initialRole = roleParam === 'dealer' || location.pathname.includes('dealer')
    ? 'dealer'
    : 'individual';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-gray-50">
      <Toaster position="top-center" richColors />
      
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Car Detective</h1>
          <p className="text-gray-600">Your trusted vehicle valuation partner</p>
        </div>
        
        <AuthForm 
          initialMode={initialMode} 
          initialRole={initialRole}
        />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>By signing in, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
