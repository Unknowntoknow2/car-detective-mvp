
import React from 'react';
import { Link } from 'react-router-dom';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import MainLayout from '@/components/layout/MainLayout';

const SignInPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12">
        <div className="space-y-6 bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your credentials to access your account
            </p>
          </div>
          
          <SigninForm 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            redirectPath="/dashboard" 
          />
          
          <div className="text-center text-sm">
            <p>
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignInPage;
