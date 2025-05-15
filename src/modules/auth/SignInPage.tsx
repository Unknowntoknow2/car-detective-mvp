
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';

function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
}

export default SignInPage;
