
import React, { useState } from 'react';
import { SignupForm } from './SignupForm';

function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>
      <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
}

export default SignUpPage;
