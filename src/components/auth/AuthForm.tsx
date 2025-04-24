
import { useState } from 'react';
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

const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect to home if already authenticated
  if (session) {
    navigate('/');
    return null;
  }

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'login': return 'Sign In';
      case 'forgot-password': return 'Forgot Password';
      case 'reset-password': return 'Reset Password';
      case 'forgot-email': return 'Recover Email';
      default: return 'Authentication';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signup': return 'Create a new account to save your valuations';
      case 'login': return 'Sign in to access your saved valuations';
      case 'forgot-password': return 'Receive a password reset link via email';
      case 'reset-password': return 'Create a new password for your account';
      case 'forgot-email': return 'Find your account email using your phone number';
      default: return '';
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />;
      case 'login':
        return <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />;
      case 'forgot-password':
        return <ForgotPasswordForm isLoading={isLoading} setIsLoading={setIsLoading} />;
      case 'forgot-email':
        return <ForgotEmailForm isLoading={isLoading} setIsLoading={setIsLoading} />;
      case 'reset-password':
        return <ResetPasswordForm isLoading={isLoading} setIsLoading={setIsLoading} />;
      default:
        return null;
    }
  };

  const getToggleLink = () => {
    if (mode === 'signup') {
      return (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/auth')}
        >
          Already have an account? Sign In
        </Button>
      );
    } else if (mode === 'login') {
      return (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/auth/signup')}
        >
          Don't have an account? Sign Up
        </Button>
      );
    } else if (mode === 'forgot-password' || mode === 'forgot-email' || mode === 'reset-password') {
      return (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/auth')}
        >
          Back to Sign In
        </Button>
      );
    }
    
    return null;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderForm()}
        {getToggleLink()}
      </CardContent>
    </Card>
  );
};

export default AuthForm;
