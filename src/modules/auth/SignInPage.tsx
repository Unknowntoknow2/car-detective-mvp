
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';

const SignInPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <LoginForm />
      <p className="mt-4">
        Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

export default SignInPage;
