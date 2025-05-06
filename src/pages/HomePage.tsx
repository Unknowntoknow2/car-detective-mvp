
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Car Detective</h1>
      <p className="text-xl mb-8">
        Your trusted source for accurate vehicle valuations and automotive insights.
      </p>
      <div className="flex gap-4">
        <Link to="/valuation">
          <Button>Get Free Valuation</Button>
        </Link>
        <Link to="/premium">
          <Button variant="outline">Premium Features</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
