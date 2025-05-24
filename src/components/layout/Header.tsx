
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-primary">Car Detective</Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/valuation" className="text-muted-foreground hover:text-foreground">Valuation</Link>
          <Link to="/premium-valuation" className="text-muted-foreground hover:text-foreground">Premium</Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
          <Link to="/vin-lookup" className="text-muted-foreground hover:text-foreground">VIN Lookup</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
