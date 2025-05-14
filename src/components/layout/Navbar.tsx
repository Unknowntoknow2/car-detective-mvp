
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  // Simple navbar implementation that doesn't depend on auth context
  return (
    <nav className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">Car Detective</Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/valuation" className="text-gray-600 hover:text-primary">
            Free Valuation
          </Link>
          <Link to="/premium" className="text-gray-600 hover:text-primary">
            Premium
          </Link>
          <Link to="/my-valuations" className="text-gray-600 hover:text-primary">
            My Valuations
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link to="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
