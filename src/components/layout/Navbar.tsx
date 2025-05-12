import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center font-bold text-xl text-primary">
          Valuation App
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/free" className="text-gray-700 hover:text-primary transition-colors">
            Free Valuation
          </Link>
          <Link to="/premium" className="text-gray-700 hover:text-primary transition-colors">
            Premium Valuation
          </Link>
          {user ? (
            <>
              <Link to="/my-valuations" className="text-gray-700 hover:text-primary transition-colors">
                My Valuations
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate('/sign-in')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/sign-up')}>
                Sign Up
              </Button>
            </>
          )}
        </nav>
        
        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className="w-full">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/free" className="w-full">Free Valuation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/premium" className="w-full">Premium Valuation</Link>
              </DropdownMenuItem>
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/my-valuations" className="w-full">My Valuations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/sign-in" className="w-full">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/sign-up" className="w-full">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
