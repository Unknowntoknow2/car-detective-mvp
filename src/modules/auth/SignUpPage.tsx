
import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from './SignupForm';

const SignUpPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <SignupForm />
      <p className="mt-4">
        Already have an account? <Link to="/sign-in" className="text-blue-500 hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default SignUpPage;
