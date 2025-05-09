
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext'; // Make sure this is imported

export function Navbar() {
  const { user, signOut } = useAuth?.() || {}; // Optional chaining in case AuthContext isn't fully set up

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-bold text-xl">CarDetective</Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/valuation" className="text-sm font-medium hover:text-primary transition-colors">
              Valuation
            </Link>
            <Link to="/premium" className="text-sm font-medium hover:text-primary transition-colors">
              Premium
            </Link>
            {user && (
              <Link to="/my-valuations" className="text-sm font-medium hover:text-primary transition-colors">
                My Valuations
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Button variant="outline" size="sm" onClick={() => signOut?.()}>
                Logout
              </Button>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
          <Link to="/premium">
            <Button size="sm" className="bg-primary hover:bg-primary-hover text-white">
              Try Premium
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
