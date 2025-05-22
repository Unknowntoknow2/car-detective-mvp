
import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { AuthMode } from '@/types/auth';
import { Toaster } from 'sonner';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const isSignUp = location.pathname.includes('signup');
  const mode = isSignUp ? AuthMode.SIGNUP : AuthMode.SIGNIN;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-gray-50">
      <Toaster position="top-center" richColors />
      
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Car Detective</h1>
          <p className="text-gray-600">Your trusted vehicle valuation partner</p>
        </div>
        
        <AuthForm mode={mode} />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>By signing in, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
