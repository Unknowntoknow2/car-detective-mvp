
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Car, 
  ChevronDown, 
  FileText, 
  Home, 
  LogIn, 
  Menu, 
  Store, 
  User,
  X,
  LogOut,
  Settings
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navLinks = [
  { path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
  { path: '/valuation', label: 'Get Valuation', icon: <Car className="h-4 w-4" /> },
  { path: '/premium', label: 'Premium', icon: <FileText className="h-4 w-4" /> },
  { path: '/dealer', label: 'For Dealers', icon: <Store className="h-4 w-4" /> },
];

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userDetails, signOut, userRole } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  const getInitials = (name?: string) => {
    if (!name) return user?.email?.[0]?.toUpperCase() || 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderNavLinks = () => {
    return navLinks.map((link) => (
      <Link
        key={link.path}
        to={link.path}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive(link.path)
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent hover:text-accent-foreground'
        }`}
        onClick={closeMenu}
      >
        {link.icon}
        {link.label}
      </Link>
    ));
  };

  return (
    <nav className="container flex h-16 items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
            CD
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
            CarDetective
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {renderNavLinks()}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(userDetails?.full_name || '')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={userRole === 'dealer' ? '/dealer/dashboard' : '/dashboard'} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/account" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  My Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm" variant="default">
            <Link to="/auth">Sign In</Link>
          </Button>
        )}

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col gap-6 h-full">
              <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                  <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                    CD
                  </div>
                  <span className="text-xl font-bold tracking-tight">CarDetective</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={closeMenu}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex flex-col gap-1">
                {renderNavLinks()}
              </div>
              
              <div className="mt-auto">
                {!user && (
                  <Button asChild className="w-full" onClick={closeMenu}>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default Navbar;
