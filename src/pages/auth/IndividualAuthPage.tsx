import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/forms/LoginForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { AuthMode } from '@/types/auth';

const IndividualAuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get the redirect path from location state, defaulting to dashboard
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const toggleMode = () => {
    setError(null); // Clear any previous errors when toggling mode
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12">
      <Card className="w-full max-w-md space-y-4">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-2xl font-bold">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'signin'
              ? 'Enter your credentials to access your account'
              : 'Create a new individual account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'signin' ? (
            <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
          ) : (
            <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
          )}
        </CardContent>
        <div className="px-6 py-4">
          <Button variant="link" onClick={toggleMode}>
            {mode === 'signin'
              ? 'Don\'t have an account? Sign up'
              : 'Already have an account? Sign in'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default IndividualAuthPage;
