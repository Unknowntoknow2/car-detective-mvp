
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/components/auth/forms/SignupForm';

export const SignUpPage = () => {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-14rem)] py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
