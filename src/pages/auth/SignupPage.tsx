
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { SignupForm } from '@/components/auth/forms/SignupForm';

const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12">
        <div className="space-y-6 bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your information to create an account
            </p>
          </div>
          
          <SignupForm 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            role="individual" 
          />
          
          <div className="text-center text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/sign-in" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignupPage;
