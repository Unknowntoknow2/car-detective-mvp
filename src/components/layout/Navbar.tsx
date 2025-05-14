
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Award } from 'lucide-react';

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">Car Detective</Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/valuation" className="text-gray-600 hover:text-primary">
            Valuation
          </Link>
          <Link to="/premium" className="text-gray-600 hover:text-primary flex items-center">
            <Award className="h-4 w-4 mr-1" />
            Premium
          </Link>
          
          {user ? (
            <>
              <Link to="/my-valuations" className="text-gray-600 hover:text-primary">
                My Valuations
              </Link>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </div>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
