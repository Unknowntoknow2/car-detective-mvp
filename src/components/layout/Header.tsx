
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, UserCircle, GaugeCircle, Star } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, signOut, userRole } = useAuth();
  
  // Wrap router hooks in error boundary
  let navigate: any;
  let location: any;
  
  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (error) {
    console.error('Router context not available:', error);
    // Fallback for when router context is not available
    navigate = () => {};
    location = { pathname: '/' };
  }

  const handleLogout = async () => {
    await signOut();
    try {
      navigate('/');
    } catch (error) {
      window.location.href = '/';
    }
  };

  const goToDashboard = () => {
    try {
      if (userRole === 'dealer') return navigate('/dealer/dashboard');
      if (userRole === 'admin') return navigate('/admin/dashboard');
      return navigate('/dashboard');
    } catch (error) {
      if (userRole === 'dealer') window.location.href = '/dealer/dashboard';
      else if (userRole === 'admin') window.location.href = '/admin/dashboard';
      else window.location.href = '/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-primary">
          Car Detective
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/valuation" className="hover:text-primary">Valuation</Link>
          <Link to="/premium" className="hover:text-primary">Premium</Link>
          {user && (
            <Button variant="ghost" onClick={goToDashboard} className="flex items-center gap-1">
              <GaugeCircle className="h-4 w-4" /> Dashboard
            </Button>
          )}
        </nav>

        {/* Auth Buttons or Profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium hover:text-primary">Sign In</Link>
              <Link to="/register" className="text-sm font-medium hover:text-primary">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <Menu className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};

export default Header;
