
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, UserCircle, GaugeCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, userDetails, signOut } = useAuth();
  
  // Wrap router hooks in error boundary
  let navigate: any;
  let location: any;
  
  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (error) {
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
      if (userDetails?.role === 'dealer') return navigate('/dealer-dashboard');
      if (userDetails?.role === 'admin') return navigate('/admin/dashboard');
      return navigate('/dashboard');
    } catch (error) {
      if (userDetails?.role === 'dealer') window.location.href = '/dealer-dashboard';
      else if (userDetails?.role === 'admin') window.location.href = '/admin/dashboard';
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
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-sm text-muted-foreground truncate max-w-48">
                {userDetails?.full_name || user.email}
              </span>
              {userDetails?.role && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {userDetails.role}
                </span>
              )}
              <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium hover:text-primary">Sign In</Link>
              <Button asChild size="sm">
                <Link to="/auth">Get Started</Link>
              </Button>
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
