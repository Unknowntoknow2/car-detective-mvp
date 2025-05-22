
import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { AuthMode } from '@/types/auth';
import { Toaster } from 'sonner';

function AuthPage() {
  const location = useLocation();
  // Extract mode and role from query parameters if present
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode') as AuthMode || AuthMode.SIGNIN;
  const role = queryParams.get('role') || 'individual';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Toaster position="top-center" richColors />
      <div className="max-w-md w-full">
        <AuthForm initialMode={mode} initialRole={role} />
      </div>
    </div>
  );
}

export default AuthPage;
