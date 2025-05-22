
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Home, User, DollarSign, Building } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl mr-8">Car Detective</Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className={`flex items-center gap-1.5 text-sm ${isActive('/') ? 'text-primary font-medium' : 'text-gray-600'}`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/valuation" 
                className={`flex items-center gap-1.5 text-sm ${isActive('/valuation') ? 'text-primary font-medium' : 'text-gray-600'}`}
              >
                <Car className="h-4 w-4" />
                <span>Valuation</span>
              </Link>
              <Link 
                to="/premium" 
                className={`flex items-center gap-1.5 text-sm ${isActive('/premium') ? 'text-primary font-medium' : 'text-gray-600'}`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Premium</span>
              </Link>
              <Link 
                to="/dealer/dashboard" 
                className={`flex items-center gap-1.5 text-sm ${isActive('/dealer/dashboard') ? 'text-primary font-medium' : 'text-gray-600'}`}
              >
                <Building className="h-4 w-4" />
                <span>Dealer</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
            <Link to="/valuation">
              <Button size="sm">Get Valuation</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
