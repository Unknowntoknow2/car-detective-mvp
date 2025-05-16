
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Our Application</h1>
      
      <div className="space-y-4">
        <p className="text-lg">Please sign in or create an account to continue.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link to="/sign-in">
            <Button variant="default" size="lg">Sign In</Button>
          </Link>
          
          <Link to="/sign-up">
            <Button variant="outline" size="lg">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
