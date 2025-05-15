
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserDropdown } from './UserDropdown';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Menu, Building, Sparkles } from 'lucide-react';
import MobileMenu from './MobileMenu';
import Logo from './Logo';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/valuation" className="text-sm font-medium transition-colors hover:text-primary">
              Valuations
            </Link>
            <Link to="/decoder" className="text-sm font-medium transition-colors hover:text-primary">
              VIN Decoder
            </Link>
            <Link to="/premium" className="text-sm font-medium transition-colors hover:text-primary flex items-center">
              <Sparkles className="mr-1 h-4 w-4" />
              Premium
            </Link>
          </nav>
        </div>
        
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
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      )}
    </header>
  );
}

export default Navbar;
