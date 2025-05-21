
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { AuthMode } from '@/types/auth';
import { SignupForm } from './forms/SignupForm';
import { LoginForm } from './forms/LoginForm';
import { ForgotPasswordForm } from './forms/ForgotPasswordForm';
import { ForgotEmailForm } from './forms/ForgotEmailForm';
import { ResetPasswordForm } from './forms/ResetPasswordForm';
import { ScrollArea } from "@/components/ui/scroll-area";

const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { session, user } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (session && user) {
      navigate('/');
    }
  }, [session, user, navigate]);

  const getTitle = () => {
    switch (mode) {
      case AuthMode.SIGNUP: return 'Create Account';
      case AuthMode.SIGNIN: return 'Sign In';
      case AuthMode.FORGOT_PASSWORD: return 'Forgot Password';
      case AuthMode.RESET_PASSWORD: return 'Reset Password';
      case AuthMode.FORGOT_EMAIL: return 'Recover Username';
      default: return 'Authentication';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case AuthMode.SIGNUP: return 'Create a new account to save your valuations';
      case AuthMode.SIGNIN: return 'Sign in to access your saved valuations';
      case AuthMode.FORGOT_PASSWORD: return 'Receive a password reset link via email';
      case AuthMode.RESET_PASSWORD: return 'Create a new password for your account';
      case AuthMode.FORGOT_EMAIL: return 'Find your account username using your phone number';
      default: return '';
    }
  };

  const renderForm = () => {
    switch (mode) {
      case AuthMode.SIGNUP:
        return <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />;
      case AuthMode.SIGNIN:
        return <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />;
      case AuthMode.FORGOT_PASSWORD:
        return <ForgotPasswordForm isLoading={isLoading} setIsLoading={setIsLoading} />;
      case AuthMode.FORGOT_EMAIL:
        return <ForgotEmailForm isLoading={isLoading} setIsLoading={setIsLoading} />;
      case AuthMode.RESET_PASSWORD:
        return <ResetPasswordForm isLoading={isLoading} setIsLoading={setIsLoading} />;
      default:
        return null;
    }
  };

  const getToggleLink = () => {
    if (mode === AuthMode.SIGNUP) {
      return (
        <Button
          type="button"
          variant="ghost"
          className="w-full rounded-xl transition-all duration-200"
          onClick={() => navigate('/auth')}
        >
          Already have an account? Sign In
        </Button>
      );
    } else if (mode === AuthMode.SIGNIN) {
      return (
        <Button
          type="button"
          variant="ghost"
          className="w-full rounded-xl transition-all duration-200"
          onClick={() => navigate('/auth/signup')}
        >
          Don't have an account? Sign Up
        </Button>
      );
    } else if (mode === AuthMode.FORGOT_PASSWORD || mode === AuthMode.FORGOT_EMAIL || mode === AuthMode.RESET_PASSWORD) {
      return (
        <Button
          type="button"
          variant="ghost"
          className="w-full rounded-xl transition-all duration-200"
          onClick={() => navigate('/auth')}
        >
          Back to Sign In
        </Button>
      );
    }
    
    return null;
  };

  // Don't render if redirecting
  if (session && user) return null;

  return (
    <Card className="w-full max-w-md shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="space-y-1 px-6 py-5">
        <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="max-h-[400px] overflow-y-auto pr-4 mb-6">
          {renderForm()}
        </div>
        <div>
          {getToggleLink()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
