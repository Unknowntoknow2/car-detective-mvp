
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, ChevronDown } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <span className="hidden sm:inline-block">CarDetective</span>
            <span className="sm:hidden">CD</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/free-valuation" className="text-sm font-medium hover:text-primary transition-colors">
            Free Valuation
          </Link>
          <Link to="/premium" className="text-sm font-medium hover:text-primary transition-colors">
            Premium
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
              Tools <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute top-full right-0 mt-1 w-48 bg-background rounded-md shadow-lg border border-border hidden group-hover:block">
              <div className="py-1">
                <Link to="/vin-lookup" className="block px-4 py-2 text-sm hover:bg-primary/10">
                  VIN Lookup
                </Link>
                <Link to="/plate-lookup" className="block px-4 py-2 text-sm hover:bg-primary/10">
                  Plate Lookup
                </Link>
              </div>
            </div>
          </div>
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                My Account <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full right-0 mt-1 w-48 bg-background rounded-md shadow-lg border border-border hidden group-hover:block">
                <div className="py-1">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-primary/10">
                    Dashboard
                  </Link>
                  <Link to="/saved" className="block px-4 py-2 text-sm hover:bg-primary/10">
                    Saved Valuations
                  </Link>
                  <button 
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/10 text-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          )}
          <Link to="/premium">
            <Button size="sm">Get Premium</Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-primary" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg">
            <nav className="container py-4 flex flex-col space-y-4">
              <Link 
                to="/free-valuation" 
                className="px-4 py-3 rounded-md hover:bg-primary/10 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Free Valuation
              </Link>
              <Link 
                to="/premium" 
                className="px-4 py-3 rounded-md hover:bg-primary/10 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Premium
              </Link>
              <div className="border-t border-border/60 my-2"></div>
              <Link 
                to="/vin-lookup" 
                className="px-4 py-3 rounded-md hover:bg-primary/10 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                VIN Lookup
              </Link>
              <Link 
                to="/plate-lookup" 
                className="px-4 py-3 rounded-md hover:bg-primary/10 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Plate Lookup
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-border/60 my-2"></div>
                  <Link 
                    to="/dashboard" 
                    className="px-4 py-3 rounded-md hover:bg-primary/10 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/saved" 
                    className="px-4 py-3 rounded-md hover:bg-primary/10 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Saved Valuations
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-md hover:bg-red-100 text-red-500 text-sm font-medium text-left w-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="px-4 py-3 rounded-md hover:bg-primary/10 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
              
              <div className="pt-2">
                <Link 
                  to="/premium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Get Premium</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
