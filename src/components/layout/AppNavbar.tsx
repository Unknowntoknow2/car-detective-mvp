
import React from 'react';
import { cn } from '@/lib/utils';
import { ButtonEnhanced } from '@/components/ui/button-enhanced';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

const NavItem = ({ href, children, active }: NavItemProps) => (
  <a
    href={href}
    className={cn(
      "text-sm font-medium px-3 py-2 rounded-md transition-colors",
      active 
        ? "text-primary bg-primary-light/30" 
        : "text-gray-700 hover:text-primary hover:bg-gray-100/50"
    )}
  >
    {children}
  </a>
);

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => (
  <button
    type="button"
    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
    onClick={onClick}
    aria-expanded={isOpen}
  >
    <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
    {/* Hamburger icon */}
    {!isOpen ? (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ) : (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )}
  </button>
);

interface AppNavbarProps {
  className?: string;
}

export function AppNavbar({ className }: AppNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className={cn("bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-primary text-xl font-bold">Car Detective™</span>
            </a>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-1">
            <NavItem href="/valuation" active>Valuation</NavItem>
            <NavItem href="/premium">Premium</NavItem>
            <NavItem href="/history">Vehicle History</NavItem>
            <NavItem href="/dealers">Dealer Network</NavItem>
          </div>
          
          {/* Desktop actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <ButtonEnhanced variant="ghost" size="sm">Sign In</ButtonEnhanced>
            <ButtonEnhanced>Get Started</ButtonEnhanced>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavItem href="/valuation" active>Valuation</NavItem>
          <NavItem href="/premium">Premium</NavItem>
          <NavItem href="/history">Vehicle History</NavItem>
          <NavItem href="/dealers">Dealer Network</NavItem>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="px-4 flex items-center justify-between">
            <ButtonEnhanced size="sm" variant="ghost" className="w-full mr-2">Sign In</ButtonEnhanced>
            <ButtonEnhanced size="sm" className="w-full">Get Started</ButtonEnhanced>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
