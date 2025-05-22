
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { AuthMode } from '@/types/auth';
import { SignupForm } from './forms/SignupForm';
import { SigninForm } from './forms/SigninForm';

interface AuthFormProps {
  mode?: AuthMode;
  redirectPath?: string;
}

const AuthForm = ({ 
  mode = AuthMode.SIGNIN,
  redirectPath = '/dashboard'
}: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<AuthMode>(mode);
  const navigate = useNavigate();
  const location = useLocation();
  const { session, user } = useAuth();
  
  // Get the redirect path from location state if available
  const from = location.state?.from || redirectPath;

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (session && user) {
      navigate(from, { replace: true });
    }
  }, [session, user, navigate, from]);

  const getTitle = () => {
    switch (currentMode) {
      case AuthMode.SIGNUP: return 'Create Account';
      case AuthMode.SIGNIN: return 'Sign In';
      default: return 'Authentication';
    }
  };

  const getDescription = () => {
    switch (currentMode) {
      case AuthMode.SIGNUP: return 'Create a new account to save your valuations';
      case AuthMode.SIGNIN: return 'Sign in to access your saved valuations';
      default: return '';
    }
  };

  const renderForm = () => {
    switch (currentMode) {
      case AuthMode.SIGNUP:
        return <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} redirectPath={from} />;
      case AuthMode.SIGNIN:
      default:
        return <SigninForm isLoading={isLoading} setIsLoading={setIsLoading} redirectPath={from} />;
    }
  };

  const toggleMode = () => {
    setCurrentMode(currentMode === AuthMode.SIGNIN ? AuthMode.SIGNUP : AuthMode.SIGNIN);
  };

  // Don't render if redirecting
  if (session && user) return null;

  return (
    <Card className="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="space-y-1 px-6 py-5 bg-muted/50">
        <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-6">
        <div className="mb-6">
          {renderForm()}
        </div>
        <div className="text-center pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={toggleMode}
          >
            {currentMode === AuthMode.SIGNIN 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Sign In"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
