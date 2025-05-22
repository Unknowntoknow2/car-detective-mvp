
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Home, User, DollarSign, Building, Search, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { path: '/valuation', label: 'Valuation', icon: <Car className="h-4 w-4" /> },
    { path: '/premium', label: 'Premium', icon: <DollarSign className="h-4 w-4" /> },
    { path: '/dealer/dashboard', label: 'Dealer', icon: <Building className="h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl mr-8">Car Detective</Link>
          
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-1.5 text-sm ${isActive(item.path) ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 pt-6">
                {navItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`flex items-center gap-2 text-base ${isActive(item.path) ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Link 
                  to="/auth" 
                  className="flex items-center gap-2 mt-4 text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>{user ? 'Dashboard' : 'Sign In'}</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Search button */}
          <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>

          {/* Authentication button */}
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{user ? 'Dashboard' : 'Sign In'}</span>
            </Button>
          </Link>

          {/* Valuation button */}
          <Link to="/valuation">
            <Button size="sm">Get Valuation</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
