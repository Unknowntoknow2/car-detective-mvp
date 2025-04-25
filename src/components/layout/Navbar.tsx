import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, signOut, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            CD
          </div>
          <span className="font-display font-bold text-xl hidden sm:inline-block">
            CarDetective
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/free">Free Valuation</NavLink>
          <NavLink href="/premium" isActive>Premium</NavLink>
          <NavLink href="/valuations">Valuations</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
        
        <button 
          className="md:hidden p-2 rounded-md hover:bg-surface"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        <div className="hidden md:flex items-center space-x-4">
          {isLoading ? (
            <div className="h-9 w-24 bg-surface animate-pulse rounded-md"></div>
          ) : user ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/valuations">My Valuations</Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email ? user.email.split('@')[0] : 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs text-text-secondary">
                    {user.email || user.phone || 'User'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/valuations" className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-primary-light flex items-center justify-center">
                        <FileIcon className="h-3 w-3 text-primary" />
                      </span>
                      My Valuations
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-primary-light flex items-center justify-center">
                        <UserIcon className="h-3 w-3 text-primary" />
                      </span>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()} 
                    className="text-error flex items-center gap-2"
                  >
                    <span className="h-5 w-5 rounded-full bg-error-light flex items-center justify-center">
                      <LogOut className="h-3 w-3 text-error" />
                    </span>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth?mode=login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary-hover" asChild>
                <Link to="/auth?mode=signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border animate-fade-in">
          <div className="px-4 py-2 space-y-1">
            <MobileNavLink href="/">Home</MobileNavLink>
            <MobileNavLink href="/free">Free Valuation</MobileNavLink>
            <MobileNavLink href="/premium" isActive>Premium</MobileNavLink>
            <MobileNavLink href="/valuations">Valuations</MobileNavLink>
            <MobileNavLink href="/about">About</MobileNavLink>
            <MobileNavLink href="/contact">Contact</MobileNavLink>
            
            <div className="pt-2 mt-2 border-t border-border">
              {isLoading ? (
                <div className="h-9 w-full bg-surface animate-pulse rounded-md"></div>
              ) : user ? (
                <>
                  <MobileNavLink href="/valuations">My Valuations</MobileNavLink>
                  <MobileNavLink href="/profile">Profile</MobileNavLink>
                  <button 
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-error hover:bg-surface rounded-md text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink href="/auth?mode=login">Sign In</MobileNavLink>
                  <Link 
                    to="/auth?mode=signup"
                    className="block w-full mt-2 text-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children, isActive = false }: { 
  href: string; 
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link
      to={href}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative
                 ${isActive 
                   ? 'text-primary' 
                   : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                 }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transform translate-y-2"></span>
      )}
    </Link>
  );
}

function MobileNavLink({ href, children, isActive = false }: { 
  href: string; 
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link
      to={href}
      className={`block px-4 py-2 rounded-md text-sm font-medium ${
        isActive 
          ? 'text-primary bg-primary-light/50' 
          : 'text-text-secondary hover:text-text-primary hover:bg-surface'
      }`}
    >
      {children}
    </Link>
  );
}

const FileIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);
