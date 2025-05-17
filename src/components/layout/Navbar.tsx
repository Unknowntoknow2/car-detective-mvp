
import React, { useState } from 'react';
import { CDNavbar } from '@/components/ui-kit/CDNavbar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Menu, Sparkles } from 'lucide-react';
import MobileMenu from './MobileMenu';
import Logo from './Logo';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items
  const navItems = [
    { label: "Home", href: "/", isActive: window.location.pathname === "/" },
    { label: "Valuations", href: "/valuation", isActive: window.location.pathname.startsWith("/valuation") },
    { label: "VIN Decoder", href: "/decoder", isActive: window.location.pathname.startsWith("/decoder") },
    { 
      label: <div className="flex items-center"><Sparkles className="mr-1 h-4 w-4" />Premium</div>, 
      href: "/premium", 
      isActive: window.location.pathname.startsWith("/premium") 
    },
  ];

  return (
    <CDNavbar
      logoComponent={<Logo />}
      navItems={navItems}
      actions={
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      }
      variant="solid"
      sticky
      collapsed={isMobileMenuOpen}
      onToggle={toggleMobileMenu}
    />
  );
}

export default Navbar;
