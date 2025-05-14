
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { X, Home, Car, Search, Crown, LogOut, Settings, User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Close menu when navigating
  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [setIsOpen]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed inset-0 z-50 md:hidden"
    >
      <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="fixed inset-y-0 right-0 bg-background w-4/5 max-w-sm shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">Menu</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <div className="flex flex-col space-y-1">
            <Button 
              variant="ghost" 
              className="justify-start pl-4"
              onClick={() => handleNavigation('/')}
            >
              <Home className="mr-3 h-5 w-5" />
              Home
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start pl-4"
              onClick={() => handleNavigation('/valuation')}
            >
              <Car className="mr-3 h-5 w-5" />
              Valuations
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start pl-4"
              onClick={() => handleNavigation('/decoder')}
            >
              <Search className="mr-3 h-5 w-5" />
              VIN Decoder
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start pl-4"
              onClick={() => handleNavigation('/premium')}
            >
              <Crown className="mr-3 h-5 w-5" />
              Premium
            </Button>
          </div>
          
          <div className="border-t my-4" />
          
          {user ? (
            <div className="flex flex-col space-y-1">
              <Button 
                variant="ghost" 
                className="justify-start pl-4"
                onClick={() => handleNavigation('/dashboard')}
              >
                <User className="mr-3 h-5 w-5" />
                Dashboard
              </Button>
              
              <Button 
                variant="ghost" 
                className="justify-start pl-4"
                onClick={() => handleNavigation('/settings')}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Button>
              
              <Button 
                variant="ghost" 
                className="justify-start pl-4 text-red-500 hover:text-red-700 hover:bg-red-100"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-4 px-4">
              <Button 
                className="w-full"
                onClick={() => handleNavigation('/auth')}
              >
                Sign In
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => handleNavigation('/register')}
              >
                Create Account
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
