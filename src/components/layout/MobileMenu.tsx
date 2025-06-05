
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Valuation', href: '/valuation' },
    { label: 'Premium', href: '/premium' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t shadow-lg z-50">
          <nav className="flex flex-col py-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="px-4 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 py-2 border-t mt-2">
              <Link
                to="/sign-in"
                className="block w-full text-center py-2 text-sm font-medium text-gray-700 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="block w-full text-center py-2 mt-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
